import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as Highcharts from 'highcharts';

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
import { StateService } from './services/state.service';
import { Page } from './interfaces/Page';
import { Char } from './interfaces/Char';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private store: Store<AppState>, private stateService:StateService){}
  
  pageNum:number = 1;
  resultsNum:number = 50;
  readonly resultsNumPerPage:number = 50;
  
  chars$:BehaviorSubject<Char[]> = this.stateService.getChars();
  charsPage$ = this.store.select(selectCharsPage);
  resultsIndexes:null[] = Array(this.resultsNum).fill(null);
  
  ngOnInit(){
    this.store.dispatch(fetchCharsPage());
    this.observePage();
  }
  
  onNextPage(page: Page){
    let chars = <Char[]>page.data;
    chars = <Char[]>[...this.chars$.getValue(), ...chars]; // NOTE merging
    
    this.chars$.next(chars);
  }
  
  observePage(){
    this.charsPage$.subscribe({
      next: this.onNextPage.bind(this),
      error: console.log,
      complete: () => console.log('Complete')
    });
  }
}
