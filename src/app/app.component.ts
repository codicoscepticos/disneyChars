import { Component } from '@angular/core';
import { Observable } from 'rxjs';
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
  
  // chars$
  charsPage$ = this.store.select(selectCharsPage);
  resultsIndexes:null[] = Array(this.resultsNum).fill(null);
  
  ngOnInit(){
    // this.stateService.setChars(this.chars$);
    this.store.dispatch(fetchCharsPage());
    this.observePage();
  }
  
  getChars(){
    // return this.chars$;
  }
  
  observePage(){
    this.charsPage$.subscribe({
      next: value => console.log(value),
      error: error => console.log(error),
      complete: () => console.log('Complete')
    });
  }
}
