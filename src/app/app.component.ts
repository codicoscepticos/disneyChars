import { Component, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Store } from '@ngrx/store';
import {
  // [Disney API]
  fetchCharsPage,
  fetchSearchCharsPage,
  // [Chars]
  displayNextPage,
  displayPrevPage,
  searchResults,
  selectResultsNum,
  sortByName,
  // [Char Row]
  displayCharPage
} from './state/state.actions';
import { selectCharsPage, selectSearchCharsPage } from './state/state.selectors';

import {
  AppState,
  Char,
  CharsMode,
  HandlerPerMsg,
  Message,
  Page,
  SearchPage,
  SortingMode
} from './Types';

import { DisneyAPIService } from './services/disney-api.service';
// import { MessengerService } from './services/messenger.service';

import { PieChartComponent } from './pie-chart/pie-chart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(PieChartComponent) private pieChartComponent!:PieChartComponent;
  
  constructor(
    // private messengerService:MessengerService,
    private store: Store<AppState>
  ){
    AppComponent.assignHandlersForMsgs();
  }
  
  static readonly nextSortingModePerCur: {[key in SortingMode]: SortingMode} = {
    original: 'ascending',
    ascending: 'descending',
    descending: 'original'
  };
  
  static readonly prefixPerSortingMode: {[key in SortingMode]: string } = {
    original: '',
    ascending: '↑',
    descending: '↓'
  };
  
  lastFetchedPageIndex:number = 0;
  lastRequestedPageIndex:number = 0;
  maxRequestedPageIndex:number = 0;
  maxResultsNum:number = Infinity;
  resultsNum:number = 0;
  totalPages:number = Infinity;
  
  chars$ = new BehaviorSubject<Char[]>([]);
  charsPage$ = this.store.select(selectCharsPage); // RETHINK This and below maybe move inside observePage
  searchChars$ = new BehaviorSubject<Char[]>([]);
  searchCharsPage$ = this.store.select(selectSearchCharsPage);
  
  charsMode:CharsMode = 'default';
  initialResultsNumPerPage:number = 50; // RETHINK Is it fixed? Or is it updated?
  nameTitlePrefix:string = '';
  nextPageBtnState:string = 'enabled';
  pageIndex:number = 1; // NOTE Changes according if going to prev or next page.
  prevPageIndex:number = 1;
  resultsIndexes:number[] = [];
  resultsNumPerPage:number = 50; // NOTE Updated via the dropdown menu.
  selChar:Char|undefined = undefined;
  sortingMode:SortingMode = 'original';
  
  ngOnInit(){}
  ngAfterViewInit(){
    this.updateResultsIndexes();
    
    // this.setMessengerObserver();
    this.setPageObserver().setSearchPageObserver();
    
    this.maxRequestedPageIndex = 1;
    this.fetchCharsPageByIndex(1);
  }
  
  // TODO Move all to helper service.
  static sortAscendinglyByNumber(n1:number, n2:number){
    return n1 - n2;
  }
  static sortAscendinglyByText(t1:string, t2:string){
    return t1.localeCompare(t2);
  }
  static sortDescendinglyByNumber(n1:number, n2:number){
    return n2 - n1;
  }
  static sortDescendinglyByText(t1:string, t2:string){
    return t2.localeCompare(t1);
  }
  static readonly sortingPerMode = {
    ascending: {
      byNumber: AppComponent.sortAscendinglyByNumber,
      byText: AppComponent.sortAscendinglyByText
    },
    descending: {
      byNumber: AppComponent.sortDescendinglyByNumber,
      byText: AppComponent.sortDescendinglyByText
    }
  };

  //==== Observers ====
  
  // observeMsg(msg:Message){
  // }
  // setMessengerObserver(){
  //   const observeMsg = this.observeMsg.bind(this);
  //   const messenger$ = this.messengerService.getMessenger$();
  //   messenger$.subscribe(observeMsg);
  //   return this;
  // }
  
  private isNextPageObserved:boolean = false;
  observeNextPage(page:Page){
    if (!this.isNextPageObserved) {
      this.isNextPageObserved = true;
      return;
    }
    
    let chars = <Char[]>page.data;
    
    let chars$ = this.chars$;
    let chars$Value = chars$.getValue();
    chars = <Char[]>[...chars$Value, ...chars]; // NOTE merging
    chars$.next(chars);
    
    this.resultsNum = chars.length;
    
    let lastFetchedPageIndex = this.lastFetchedPageIndex += 1;
    
    let totalPages = this.totalPages = page.totalPages;
    if (totalPages === lastFetchedPageIndex) {
      this.maxResultsNum = this.resultsNum;
      this.updateNextPageBtnState();
    } else {
      this.maxResultsNum = totalPages * DisneyAPIService.resultsNumPerPage; // TODO Move to ngOnInit
    }
    
    if (lastFetchedPageIndex >= this.maxRequestedPageIndex) return;
    
    this.updateResultsIndexes().sortResultsIndexes().updateChartData();
  }
  setPageObserver(){
    this.charsPage$.subscribe({
      next: this.observeNextPage.bind(this),
      error: console.log,
      complete: ()=>console.log('Complete')
    });
    return this;
  }
  
  private isSearchPageObserved:boolean = false;
  observeSearchPage(page:SearchPage){
    if (!this.isSearchPageObserved) {
      this.isSearchPageObserved = true;
      return;
    }
    
    let searchChars = <Char[]>page.data;
    this.searchChars$.next(searchChars);
    this.resultsNum = searchChars.length;
    
    this.updateResultsIndexes();
    this.sortResultsIndexes().updateChartData();
  }
  setSearchPageObserver(){
    this.searchCharsPage$.subscribe({
      next: this.observeSearchPage.bind(this),
      error: console.log,
      complete: ()=>console.log('Complete')
    });
    return this;
  }
  
  //==== Methods ====
  
  fetchCharsPageByIndex(pageIndex:number){
    this.lastRequestedPageIndex = pageIndex;
    this.store.dispatch(fetchCharsPage({pageIndex}));
    return this;
  }
  
  fetchCharsPages(num:number){
    let totalPages = this.totalPages;
    let maxRequestedPageIndex = this.maxRequestedPageIndex += num;
    if (maxRequestedPageIndex > totalPages) {
      num -= (maxRequestedPageIndex - totalPages);
      this.maxRequestedPageIndex = totalPages;
    }
    
    let lastRequestedPageIndex = this.lastRequestedPageIndex;
    const startIndex = lastRequestedPageIndex + 1;
    const endIndex = lastRequestedPageIndex + num;
    for (let i = startIndex; i <= endIndex; i += 1) {
      this.fetchCharsPageByIndex(i);
    }
  }
  
  fetchSearchCharsPageByIndex(query:string){
    this.store.dispatch(fetchSearchCharsPage({query}));
    return this;
  }
  
  generateIndexes(){ // RETHINK Maybe move to a helper service. Take into consideration resultsNum?
    let indexes = [];
    
    let pageIndex = this.pageIndex;
    let resultsNumPerPage = this.resultsNumPerPage;
    const startIndex = resultsNumPerPage * (pageIndex - 1);
    const endIndex = resultsNumPerPage * pageIndex - 1;
    for (let i = startIndex; i <= endIndex; i += 1) {
      indexes.push(i);
    }
    
    return indexes;
  }
  
  getCharsByIndexes(chars$:BehaviorSubject<Char[]>, indexes:number[]){
    let chars:Char[] = chars$.getValue();
    return indexes.map(i=>chars[i]).filter(c=>c); // TODO generateIndexes to consider resultsNum (remove filter when ready)
  }
  
  sortResultsIndexes(){
    let resultsIndexes = this.resultsIndexes;
    resultsIndexes.sort(AppComponent.sortingPerMode.ascending.byNumber);
    
    let sortingMode = this.sortingMode;
    if (sortingMode === 'original') return this;
    
    const chars$ = (this.charsMode === 'search') ? this.searchChars$ : this.chars$;
    const chars = this.getCharsByIndexes(chars$, resultsIndexes);
    let names = chars.map(char => char.name); // TODO Become method.
    resultsIndexes = resultsIndexes.slice(0, names.length);
    
    const startIndex = resultsIndexes[0];
    resultsIndexes.sort(function(i1:number, i2:number){ // TODO Become method.
      if (startIndex > 0) {
        i1 = i1 % startIndex;
        i2 = i2 % startIndex;
      }
      let name1 = names[i1];
      let name2 = names[i2];
      if (sortingMode === 'descending') {
        const t = name1;
        name1 = name2;
        name2 = t;
      }
      return name1.localeCompare(name2);
    });
    this.updateResultsIndexes(resultsIndexes);
    
    return this;
  }
  
  updateChartData(){
    const chars$ = (this.charsMode === 'search') ? this.searchChars$ : this.chars$; // RETHINK implementation
    const chars = this.getCharsByIndexes(chars$, this.resultsIndexes);
    this.pieChartComponent.updateChartData(chars);
    return this;
  }
  
  updateNextPageBtnState(){
    const maxPageIndex = Math.ceil(this.maxResultsNum / this.resultsNumPerPage);
    this.nextPageBtnState = (this.pageIndex < maxPageIndex) ? 'enabled' : 'disabled';
  }
  
  updateResultsIndexes(resultsIndexes?:number[]){
    this.resultsIndexes = resultsIndexes || this.generateIndexes();
    return this;
  }
  
  updateSelChar(char:Char|undefined){
    this.selChar = char;
    return this;
  }
  
  hasSufficientResults(pageIndex:number){
    let startIndex = (pageIndex - 1) * this.resultsNumPerPage;
    const endIndex = this.resultsNum - 1;
    if (startIndex <= endIndex) return true;
    
    let chars = this.chars$.getValue();
    const isChar = chars[startIndex];
    if (isChar !== undefined) return true;
    
    return false;
  }
  
  //==== Messaging ====
  
  handleMsg(msg:Message){ // Message Handler (for child)
    const handler = <Function>AppComponent.handlerPerMsg[msg.name];
    if (handler) handler.call(this, msg.content);
  }
  handleCharSelected(char:Char|undefined){
    this.updateSelChar(char);
  }
  handleNameClicked(){
    let sortingMode = this.sortingMode = AppComponent.nextSortingModePerCur[this.sortingMode];
    const prefix = AppComponent.prefixPerSortingMode[sortingMode];
    this.nameTitlePrefix = prefix;
    this.sortResultsIndexes();
  }
  handlePageTurned(diff:number){
    let pageIndex = this.pageIndex += diff;
    this.updateResultsIndexes().updateNextPageBtnState();
    
    if (this.hasSufficientResults(pageIndex)) {
      this.sortResultsIndexes().updateChartData();
      return;
    }
    
    const pagesToFetchNum = Math.ceil(this.resultsNumPerPage / DisneyAPIService.resultsNumPerPage);
    this.fetchCharsPages(pagesToFetchNum);
  }
  handleResultsNumPerPageChanged(newResultsNumPerPage:number){
    this.pageIndex = Math.floor((this.pageIndex - 1) * (this.resultsNumPerPage / newResultsNumPerPage) + 1);
    
    this.resultsNumPerPage = newResultsNumPerPage;
    this.updateResultsIndexes().updateNextPageBtnState();
    
    let resultsNum = this.resultsNum;
    const newResultsNum = Math.ceil(resultsNum / newResultsNumPerPage) * newResultsNumPerPage;
    let pagesToFetchNum = (newResultsNum - resultsNum) / DisneyAPIService.resultsNumPerPage;
    if (pagesToFetchNum > 0) this.fetchCharsPages(pagesToFetchNum);
    else this.sortResultsIndexes().updateChartData();
  }
  handleSearchInputCleared(){
    this.charsMode = 'default';
    this.searchChars$.next([]);
    this.resultsNum = this.chars$.getValue().length;
    this.pageIndex = this.prevPageIndex;
    this.updateResultsIndexes();
    this.sortResultsIndexes().updateChartData();
  }
  handleSearchInputSubmitted(query:string){
    this.charsMode = 'search';
    this.prevPageIndex = this.pageIndex;
    this.pageIndex = 1;
    this.fetchSearchCharsPageByIndex(query);
  }
  
  static readonly handlerPerMsg: HandlerPerMsg = {
    charSelected: 'handleCharSelected',
    nameClicked: 'handleNameClicked',
    pageTurned: 'handlePageTurned',
    resultsNumPerPageChanged: 'handleResultsNumPerPageChanged',
    searchInputCleared: 'handleSearchInputCleared',
    searchInputSubmitted: 'handleSearchInputSubmitted'
  };
  static assignHandlersForMsgs(){ // TODO move to helper service
    let handlerPerMsg = AppComponent.handlerPerMsg;
    for (let msgName in handlerPerMsg) {
      const handlerName = <string>handlerPerMsg[msgName];
      handlerPerMsg[msgName] = (<any>AppComponent.prototype)[handlerName];
    }
  }
}
