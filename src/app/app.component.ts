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

import { AppMode } from './interfaces/AppMode';
import { AppState } from './interfaces/AppState';
import { Char } from './interfaces/Char';
import { HandlerPerMsg } from './interfaces/HandlerPerMsg';
import { Message } from './interfaces/Message';
import { Page } from './interfaces/Page';
import { SearchPage } from './interfaces/SearchPage';

import { DisneyAPIService } from './services/disney-api.service';
// import { MessengerService } from './services/messenger.service';

import { CharsComponent } from './chars/chars.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(CharsComponent) private charsComponent!:CharsComponent; // TODO Ensure charsComponent is always not null/undefined.
  @ViewChild(PieChartComponent) private pieChartComponent!:PieChartComponent;
  
  constructor(
    // private messengerService:MessengerService,
    private store: Store<AppState>
  ){
    AppComponent.assignHandlersForMsgs();
  }
  
  ngAfterViewInit(){}
  
  chars$ = new BehaviorSubject<Char[]>([]);
  charsPage$ = this.store.select(selectCharsPage); // RETHINK This and below maybe move inside observePage
  searchChars$ = new BehaviorSubject<Char[]>([]);
  searchCharsPage$ = this.store.select(selectSearchCharsPage);
  
  lastFetchedPageIndex:number = 0;
  lastRequestedPageIndex:number = 0;
  maxRequestedPageIndex:number = 0;
  mode:AppMode = 'default';
  resultsNum:number = 0;
  selChar:Char|undefined = undefined;
  
  ngOnInit(){
    // this.setMessengerObserver();
    this.setPageObserver().setSearchPageObserver();
    
    this.maxRequestedPageIndex = 1;
    this.fetchCharsPageByIndex(1);
  }
  
  //==== Observers ====
  
  // observeMsg(msg:Message){
  // }
  // setMessengerObserver(){
  //   const observeMsg = this.observeMsg.bind(this);
  //   const messenger$ = this.messengerService.getMessenger$();
  //   messenger$.subscribe(observeMsg);
  //   return this;
  // }
  
  observeNextPage(page:Page){
    let chars = <Char[]>page.data;
    if (chars.length === 0) return; // RETHINK Should not come as empty.
    
    let chars$ = this.chars$;
    let chars$Value = chars$.getValue();
    chars = <Char[]>[...chars$Value, ...chars]; // NOTE merging
    chars$.next(chars);
    
    this.resultsNum = chars.length;
    
    const charsComponent = this.charsComponent;
    if (charsComponent) charsComponent.updateMaxPageIndex(page.totalPages); // RETHINK ensure charsComponent
    
    this.lastFetchedPageIndex += 1;
    if (this.lastFetchedPageIndex >= this.maxRequestedPageIndex) {
      charsComponent.updateResultsIndexes();
      this.updateChartData();
    }
  }
  setPageObserver(){
    this.charsPage$.subscribe({
      next: this.observeNextPage.bind(this),
      error: console.log,
      complete: ()=>console.log('Complete')
    });
    return this;
  }
  
  observeSearchPage(page:SearchPage){
    let searchChars = <Char[]>page.data;
    this.searchChars$.next(searchChars);
    
    this.resultsNum = searchChars.length;
    
    let charsComponent = this.charsComponent;
    if (charsComponent) charsComponent.updateResultsIndexes(); // RETHINK ensure charsComponent
    
    this.updateChartData();
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
    this.maxRequestedPageIndex += num;
    
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
  
  getCharsByIndexes(chars$:BehaviorSubject<Char[]>, indexes:number[]){
    let chars:Char[] = chars$.getValue();
    return indexes.map(i=>chars[i]).filter(c=>c); // TODO generateIndexes to consider resultsNum (remove filter when ready)
  }
  
  updateChartData(){
    let charsComponent = this.charsComponent;
    if (!charsComponent) return; // RETHINK ensure charsComponent
    
    const resultsIndexes = charsComponent.getResultsIndexes();
    const chars$ = (this.mode === 'search') ? this.searchChars$ : this.chars$; // RETHINK implementation
    const chars = this.getCharsByIndexes(chars$, resultsIndexes);
    this.pieChartComponent.updateChartData(chars);
  }
  
  updateSelChar(char:Char|undefined){
    this.selChar = char;
    return this;
  }
  
  //==== Messaging ====
  
  handleMsg(msg:Message){ // Message Handler (for child)
    const handler = <Function>AppComponent.handlerPerMsg[msg.name];
    if (handler) handler.call(this, msg.content);
  }
  handleCharSelected(char:Char|undefined){
    this.updateSelChar(char);
  }
  handlePageTurned(pageIndex:number){
    let charsComponent = this.charsComponent;
    
    let resultsNum = this.resultsNum;
    let startIndex = (pageIndex - 1) * charsComponent.getResultsNumPerPage();
    const endIndex = resultsNum - 1;
    const hasSufficientResults = (resultsNum - startIndex >= charsComponent.resultsNumPerPage); // RETHINK if it's the only needed condition
    if (startIndex <= endIndex && hasSufficientResults) {
      this.updateChartData();
      return;
    }
    
    const pagesToFetchNum = Math.ceil(charsComponent.resultsNumPerPage / DisneyAPIService.resultsNumPerPage);
    this.fetchCharsPages(pagesToFetchNum);
  }
  handleResultsNumPerPageChanged({oldResultsNumPerPage, newResultsNumPerPage} // RETHINK Improve passing of multiple params.
    :{oldResultsNumPerPage:number, newResultsNumPerPage:number}
  ){
    let charsComponent = this.charsComponent;
    let pageIndex = charsComponent.getPageIndex();
    pageIndex = Math.floor((pageIndex - 1) * (oldResultsNumPerPage / newResultsNumPerPage) + 1);
    
    charsComponent.updateResultsNumPerPage(newResultsNumPerPage).updatePageIndex(pageIndex)
    .updateResultsIndexes();
    
    let resultsNum = this.resultsNum;
    const newResultsNum = Math.ceil(resultsNum / newResultsNumPerPage) * newResultsNumPerPage;
    let pagesToFetchNum = (newResultsNum - resultsNum) / DisneyAPIService.resultsNumPerPage;
    if (pagesToFetchNum < 1) {
      this.updateChartData();
      return;
    }
    
    this.fetchCharsPages(pagesToFetchNum);
  }
  handleSearchInputCleared(){
    this.mode = 'default';
    this.searchChars$.next([]);
    this.resultsNum = this.chars$.getValue().length;
    this.charsComponent.updatePageIndexToPrev().updateResultsIndexes();
    this.updateChartData();
  }
  handleSearchInputSubmitted(query:string){
    this.mode = 'search';
    this.charsComponent.updatePrevPageIndex().updatePageIndex(1);
    this.fetchSearchCharsPageByIndex(query);
  }
  
  static readonly handlerPerMsg: HandlerPerMsg = {
    charSelected: 'handleCharSelected',
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
