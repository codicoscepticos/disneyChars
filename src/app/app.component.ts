import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { BehaviorSubject } from 'rxjs';

import { Store } from '@ngrx/store';
import {
  // [Disney API]
  fetchCharsPage,
  // [Chars]
  displayNextPage,
  displayPrevPage,
  searchResults,
  selectResultsNum,
  sortByName,
  // [Char Row]
  displayCharPage
} from './state/state.actions';
import { selectCharsPage } from './state/state.selectors';

import { AppState } from './interfaces/AppState';
import { Char } from './interfaces/Char';
import { Page } from './interfaces/Page';

import { DisneyAPIService } from './services/disney-api.service';
import { MessengerService } from './services/messenger.service';
import { Message } from './interfaces/Message';
import { HandlerPerMsg } from './interfaces/HandlerPerMsg';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private messengerService:MessengerService,
    private store: Store<AppState>
  ){
    AppComponent.assignHandlersForMsgs();
  }
  
  resultsNum:number = 0; // RETHINK
  
  chars$ = new BehaviorSubject<Char[]>([]);
  charsPage$ = this.store.select(selectCharsPage); // RETHINK Maybe move inside observePage
  selChar:Char|undefined = undefined;
  
  ngOnInit(){
    // this.setMessengerObserver();
    this.setPageObserver().fetchCharsPageByIndex(1);
  }
  
  //==== Message Handler (for child) ====
  
  handleMsg(msg:Message){
    const handler = <Function>AppComponent.handlerPerMsg[msg.name];
    if (handler) handler.call(this, msg.content);
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
    chars = <Char[]>[...this.chars$.getValue(), ...chars]; // NOTE merging
    
    this.chars$.next(chars);
  }
  
  setPageObserver(){
    this.charsPage$.subscribe({
      next: this.observeNextPage.bind(this),
      error: console.log,
      complete: ()=>console.log('Complete')
    });
    return this;
  }
  
  //==== Methods ====
  
  fetchCharsPageByIndex(pageIndex:number){
    this.store.dispatch(fetchCharsPage({pageIndex}));
    this.resultsNum += DisneyAPIService.resultsNumPerPage;
    return this;
  }
  
  updateSelChar(char:Char|undefined){
    this.selChar = char;
    return this;
  }
  
  static readonly handlerPerMsg: HandlerPerMsg = {
    charSelected: 'updateSelChar',
    nextPage: 'fetchCharsPageByIndex'
  };
  static assignHandlersForMsgs(){ // TODO move to helper service
    let handlerPerMsg = AppComponent.handlerPerMsg;
    for (let msgName in handlerPerMsg) {
      const handlerName = <string>handlerPerMsg[msgName];
      handlerPerMsg[msgName] = (<any>AppComponent.prototype)[handlerName];
    }
  }
}
