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
import { StateService } from './services/state.service';
import { MessengerService } from './services/messenger.service';
import { Message } from './interfaces/Message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private messengerService:MessengerService,
    private stateService:StateService,
    private store: Store<AppState>
  ){}
  
  resultsNum:number = 50; // RETHINK
  
  chars$:BehaviorSubject<Char[]> = this.stateService.getChars$();
  charsPage$ = this.store.select(selectCharsPage); // RETHINK Maybe move inside observePage
  
  ngOnInit(){
    this.observeMessenger().fetchCharsPageByIndex(1).observePage();
  }
  
  //==== App Events ====
  
  handleMessage(msg:Message){
    if (msg.name === 'nextPage') {
      this.fetchCharsPageByIndex(msg.content);
      this.resultsNum += DisneyAPIService.resultsNumPerPage;
    }
  }
  
  handleNextPage(page:Page){
    let chars = <Char[]>page.data;
    chars = <Char[]>[...this.chars$.getValue(), ...chars]; // NOTE merging
    
    this.chars$.next(chars);
  }
  
  //==== Methods ====
  
  fetchCharsPageByIndex(pageIndex:number){
    this.store.dispatch(fetchCharsPage({pageIndex}));
    return this;
  }
  
  observeMessenger(){
    const handleMessage = this.handleMessage.bind(this);
    const messenger$ = this.messengerService.getMessenger$();
    messenger$.subscribe(handleMessage);
    return this;
  }
  
  observePage(){
    this.charsPage$.subscribe({
      next: this.handleNextPage.bind(this),
      error: console.log,
      complete: ()=>console.log('Complete')
    });
  }
}
