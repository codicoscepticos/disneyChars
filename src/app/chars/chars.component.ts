import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { MessengerService } from '../services/messenger.service';
import { StateService } from '../services/state.service';

import { Char } from '../interfaces/Char';

@Component({
  selector: 'app-chars',
  templateUrl: './chars.component.html',
  styleUrls: ['./chars.component.css']
})
export class CharsComponent {
  constructor(private messengerService:MessengerService, private stateService:StateService){}
  
  chars$:BehaviorSubject<Char[]> = this.stateService.getChars$();
  
  pageIndex:number = 1; // NOTE Changes according if going to prev or next page.
  resultsNumPerPage:number = 50; // TODO To be changed by the user. // NOTE If num of chars is less than the selected results per page of the app, should fetch the rest of the pages, and display accordingly.
  resultsIndexes:number[] = this.generateIndexes(); // TODO update also every time the user changes the results per page of the app
  
  //==== DOM Events ====
  
  onNextPage(){
    this.pageIndex += 1;
    this.resultsIndexes = this.generateIndexes();
    this.messengerService.sendMsg({name: 'nextPage', content: this.pageIndex});
  }
  
  //==== Methods ====
  
  generateIndexes(){ // RETHINK Maybe move to a helper function.
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
}
