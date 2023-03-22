import { Component, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';

import { Store } from '@ngrx/store';
import {
  // [Disney API]
  fetchCharsPage,
  fetchSearchCharsPage,
  // [Chars]
  displayNextPage,
  displayPrevPage,
  searchResults,
  sortByName,
  // [Char Row]
  displayCharPage,
  mergeChars,
  sortResultsIndexes,
  searchInputCleared,
  searchInputSubmitted,
  nameClicked,
  updateNextPageBtnState,
  updatePageIndex,
  updateResultsNumPerPage,
  updateResultsIndexes,
  updateSearchChars,
  updateSelChar,
  updateResultsNum,
  updateLastFetchedPageIndex,
  updateTotalPages,
  updateMaxResultsNum,
  updateMaxRequestedPageIndex
} from './state/state.actions';
import {
  selectChars,
  selectCharsMode,
  selectCharsPage,
  selectInitialResultsNumPerPage,
  selectLastFetchedPageIndex,
  selectLastRequestedPageIndex,
  selectMaxRequestedPageIndex,
  selectMaxResultsNum,
  selectNameTitlePrefix,
  selectNextPageBtnState,
  selectPageIndex,
  selectPrevPageIndex,
  selectResultsIndexes,
  selectResultsNum,
  selectResultsNumPerPage,
  selectSearchChars,
  selectSearchCharsPage,
  selectSelChar,
  selectSortingMode,
  selectTotalPages
} from './state/state.selectors';

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
  
  chars$:Observable<Char[]>;
  charsMode$:Observable<string>;
  charsPage$:Observable<Page>; // RETHINK This and below maybe move inside observePage
  initialResultsNumPerPage$:Observable<number>; // RETHINK Is it fixed? Or is it updated?
  nameTitlePrefix$:Observable<string>;
  nextPageBtnState$:Observable<string>;
  pageIndex$:Observable<number>; // NOTE Changes according if going to prev or next page.
  prevPageIndex$:Observable<number>;
  resultsIndexes$:Observable<number[]>;
  resultsNumPerPage$:Observable<number>; // NOTE Updated via the dropdown menu.
  searchChars$:Observable<Char[]>;
  searchCharsPage$:Observable<SearchPage>;
  selChar$:Observable<Char | undefined>;
  sortingMode$:Observable<SortingMode>;
  // Disney API
  lastFetchedPageIndex$:Observable<number>;
  lastRequestedPageIndex$:Observable<number>;
  maxRequestedPageIndex$:Observable<number>;
  maxResultsNum$:Observable<number>;
  resultsNum$:Observable<number>;
  totalPages$:Observable<number>;
  
  constructor(
    // private messengerService:MessengerService,
    private store: Store<AppState>
  ){
    let select = store.select.bind(store);
    this.chars$ = select(selectChars);
    this.charsMode$ = select(selectCharsMode);
    this.charsPage$ = select(selectCharsPage);
    this.initialResultsNumPerPage$ = select(selectInitialResultsNumPerPage);
    this.nameTitlePrefix$ = select(selectNameTitlePrefix);
    this.nextPageBtnState$ = select(selectNextPageBtnState);
    this.pageIndex$ = select(selectPageIndex);
    this.prevPageIndex$ = select(selectPrevPageIndex);
    this.resultsIndexes$ = select(selectResultsIndexes);
    this.resultsNumPerPage$ = select(selectResultsNumPerPage);
    this.searchChars$ = select(selectSearchChars);
    this.searchCharsPage$ = select(selectSearchCharsPage);
    this.selChar$ = select(selectSelChar);
    this.sortingMode$ = select(selectSortingMode);
    // Disney API
    this.lastFetchedPageIndex$ = select(selectLastFetchedPageIndex);
    this.lastRequestedPageIndex$ = select(selectLastRequestedPageIndex);
    this.maxRequestedPageIndex$ = select(selectMaxRequestedPageIndex);
    this.maxResultsNum$ = select(selectMaxResultsNum);
    this.resultsNum$ = select(selectResultsNum);
    this.totalPages$ = select(selectTotalPages);
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
  
  ngOnInit(){
    AppComponent.assignHandlersForMsgs();
  }
  ngAfterViewInit(){
    this.updateResultsIndexes();
    
    // this.setMessengerObserver();
    this.setPageObserver().setSearchPageObserver();
    
    this.store.dispatch(updateMaxRequestedPageIndex({maxRequestedPageIndex: 1}));
    this.fetchCharsPageByIndex(1);
  }
  
  static charsByIndexes(chars:Char[], indexes:number[]){ // TODO Move all to helper service.
    return indexes.map(i=>chars[i]).filter(c=>c); // TODO generateIndexes to consider resultsNum (remove filter when ready)
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
    
    const store = this.store;
    let dispatch = store.dispatch.bind(store);
    
    let chars = page.data;
    dispatch(mergeChars({chars}));
    dispatch(updateResultsNum({resultsNum: chars.length}));
    
    let lastFetchedPageIndex = this.getValue(selectLastFetchedPageIndex) + 1;
    dispatch(updateLastFetchedPageIndex({lastFetchedPageIndex}));
    
    let totalPages = page.totalPages;
    dispatch(updateTotalPages({totalPages: page.totalPages}));
    dispatch(updateMaxResultsNum());
    
    if (totalPages === lastFetchedPageIndex) this.updateNextPageBtnState();
    
    const maxRequestedPageIndex = this.getValue(selectMaxRequestedPageIndex);
    if (lastFetchedPageIndex >= maxRequestedPageIndex) return;
    
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
    
    const searchChars = <Char[]>page.data;
    this.store.dispatch(updateSearchChars({searchChars}));
    
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
    this.store.dispatch(fetchCharsPage({pageIndex}));
    return this;
  }
  
  fetchCharsPages(num:number){
    let totalPages = this.getValue(selectTotalPages);
    let maxRequestedPageIndex = this.getValue(selectMaxRequestedPageIndex) + num;
    if (maxRequestedPageIndex > totalPages) {
      num -= (maxRequestedPageIndex - totalPages);
      this.store.dispatch(updateMaxRequestedPageIndex({maxRequestedPageIndex: totalPages}));
    }
    
    let lastRequestedPageIndex = this.getValue(selectLastRequestedPageIndex);
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
    
    let pageIndex = this.getValue(selectPageIndex);
    let resultsNumPerPage = this.getValue(selectResultsNumPerPage);
    const startIndex = resultsNumPerPage * (pageIndex - 1);
    const endIndex = resultsNumPerPage * pageIndex - 1;
    for (let i = startIndex; i <= endIndex; i += 1) {
      indexes.push(i);
    }
    
    return indexes;
  }
  
  sortResultsIndexes(){
    this.store.dispatch(sortResultsIndexes());
    return this;
  }
  
  updateChartData(){
    this.pieChartComponent.updateChartData();
    return this;
  }
  
  updateNextPageBtnState(){
    this.store.dispatch(updateNextPageBtnState());
  }
  
  updateResultsIndexes(resultsIndexes?:number[]){
    const newResultsIndexes = resultsIndexes || this.generateIndexes();
    this.store.dispatch(updateResultsIndexes({resultsIndexes: newResultsIndexes}));
    return this;
  }
  
  hasSufficientResults(pageIndex:number){
    let startIndex = (pageIndex - 1) * this.getValue(selectResultsNumPerPage);
    const endIndex = this.getValue(selectResultsNum) - 1;
    if (startIndex <= endIndex) return true;
    
    let chars = this.getValue(selectChars);
    const isChar = chars[startIndex];
    if (isChar !== undefined) return true;
    
    return false;
  }
  
  getValue(selector: any){
    let value:any;
    this.store.select(selector).pipe(take(1)).subscribe(stateValue => value = stateValue);
    return value;
  }
  
  //==== Messaging ====
  
  handleMsg(msg:Message){ // Message Handler (for child)
    const handler = <Function>AppComponent.handlerPerMsg[msg.name];
    if (handler) handler.call(this, msg.content);
  }
  handleCharSelected(selChar:Char|undefined){
    this.store.dispatch(updateSelChar({selChar}));
  }
  handleNameClicked(){
    this.store.dispatch(nameClicked());
    this.sortResultsIndexes();
  }
  handlePageTurned(diff:number){
    let pageIndex = this.getValue(selectPageIndex) + diff;
    this.store.dispatch(updatePageIndex({pageIndex}));
    
    this.updateResultsIndexes().updateNextPageBtnState();
    
    if (this.hasSufficientResults(pageIndex)) {
      this.sortResultsIndexes().updateChartData();
      return;
    }
    
    const resultsNumPerPage = this.getValue(selectResultsNumPerPage);
    const pagesToFetchNum = Math.ceil(resultsNumPerPage / DisneyAPIService.resultsNumPerPage);
    this.fetchCharsPages(pagesToFetchNum);
  }
  handleResultsNumPerPageChanged(newResultsNumPerPage:number){
    let resultsNumPerPage = this.getValue(selectResultsNumPerPage);
    let pageIndex = this.getValue(selectPageIndex);
    pageIndex = Math.floor((pageIndex - 1) * (resultsNumPerPage / newResultsNumPerPage) + 1);
    this.store.dispatch(updatePageIndex({pageIndex}));
    
    this.store.dispatch(updateResultsNumPerPage({resultsNumPerPage: newResultsNumPerPage}))
    this.updateResultsIndexes().updateNextPageBtnState();
    
    let resultsNum = this.getValue(selectResultsNum);
    const newResultsNum = Math.ceil(resultsNum / newResultsNumPerPage) * newResultsNumPerPage;
    let pagesToFetchNum = (newResultsNum - resultsNum) / DisneyAPIService.resultsNumPerPage;
    if (pagesToFetchNum > 0) this.fetchCharsPages(pagesToFetchNum);
    else this.sortResultsIndexes().updateChartData();
  }
  handleSearchInputCleared(){
    this.store.dispatch(searchInputCleared());
    this.updateResultsIndexes();
    this.sortResultsIndexes().updateChartData();
  }
  handleSearchInputSubmitted(query:string){
    this.store.dispatch(searchInputSubmitted());
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
