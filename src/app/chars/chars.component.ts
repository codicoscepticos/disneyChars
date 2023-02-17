import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Char } from '../interfaces/Char';
import { HandlerPerMsg } from '../interfaces/HandlerPerMsg';
import { Message } from '../interfaces/Message';

@Component({
  selector: 'app-chars',
  templateUrl: './chars.component.html',
  styleUrls: ['./chars.component.css']
})
export class CharsComponent {
  @Input() chars$ = new BehaviorSubject<Char[]>([]);
  @Output() onMsg = new EventEmitter<Message>();
  
  constructor(){}
  
  maxPageIndex:number = Infinity;
  pageIndex:number = 1; // NOTE Changes according if going to prev or next page.
  resultsNumPerPage:number = 50; // TODO To be changed by the user. // NOTE If num of chars is less than the selected results per page of the app, should fetch the rest of the pages, and display accordingly.
  resultsIndexes:number[] = this.generateIndexes(); // TODO update also every time the user changes the results per page of the app
  
  //==== DOM Events ====
  
  onPageByDiff(diff:number){
    this.pageIndex += diff;
    this.resultsIndexes = this.generateIndexes();
    
    const msg = <Message>{name: 'pageTurned', content: this.pageIndex};
    this.onMsg.emit(msg);
  }
  
  //==== Message Handler (for child) ====
  
  handleMsg(msg:Message){
    const handler = <Function>CharsComponent.handlerPerMsg[msg.name];
    if (!handler) this.onMsg.emit(msg);
  }
  
  //==== Methods ====
  
  generateIndexes(){ // RETHINK Maybe move to a helper service.
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
  
  updateMaxPageIndex(index:number){
    this.maxPageIndex = index;
  }
  
  static readonly handlerPerMsg: HandlerPerMsg = {};
}
