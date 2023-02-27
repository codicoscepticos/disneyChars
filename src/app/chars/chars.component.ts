import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Char } from '../interfaces/Char';
import { HandlerPerMsg } from '../interfaces/HandlerPerMsg';
import { Message } from '../interfaces/Message';

@Component({
  selector: 'app-chars',
  templateUrl: './chars.component.html',
  styleUrls: ['./chars.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharsComponent {
  @Input() chars$ = new BehaviorSubject<Char[]>([]);
  @Output() msgSent = new EventEmitter<Message>();
  
  constructor(){}
  
  readonly headerCellNames = ['Name', '# TV Shows', '# Video Games', 'Allies', 'Enemies'];
  
  initialResultsNumPerPage:number = 50;
  maxPageIndex:number = Infinity;
  pageIndex:number = 1; // NOTE Changes according if going to prev or next page.
  prevPageIndex:number = 1;
  resultsIndexes:number[] = [];
  resultsNumPerPage:number = 50; // NOTE Updated via the dropdown menu.
  selectorOptions:number[] = [10, 20, 50, 100, 200, 500];
  
  ngOnInit(){
    this.updateResultsIndexes();
  }
  
  //==== DOM Events ====
  
  onOptionChanged(resultsNumPerPage:any){
    const content = {
      oldResultsNumPerPage: this.resultsNumPerPage,
      newResultsNumPerPage: resultsNumPerPage
    };
    this.sendMsg('resultsNumPerPageChanged', content);
  }
  
  onPageByDiff(diff:number){
    let pageIndex = this.pageIndex + diff;
    this.updatePageIndex(pageIndex).updateResultsIndexes();
    this.sendMsg('pageTurned', pageIndex);
  }
  
  //==== Methods ====
  
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
  
  getPageIndex(){
    return this.pageIndex;
  }
  
  getResultsNumPerPage(){
    return this.resultsNumPerPage;
  }
  
  getResultsIndexes(){
    return this.resultsIndexes;
  }
  
  updateMaxPageIndex(index:number){
    this.maxPageIndex = index;
  }
  
  updatePageIndex(index:number){
    this.pageIndex = index;
    return this;
  }
  
  updatePageIndexToPrev(){
    this.pageIndex = this.prevPageIndex;
    return this;
  }
  
  updatePrevPageIndex(){
    this.prevPageIndex = this.pageIndex;
    return this;
  }
  
  updateResultsIndexes(){
    this.resultsIndexes = this.generateIndexes();
  }
  
  updateResultsNumPerPage(resultsNumPerPage:number){
    this.resultsNumPerPage = resultsNumPerPage;
    return this;
  }
  
  //==== Messaging ====
  
  handleMsg(msg:Message){ // Message Handler (for child)
    const handler = <Function>CharsComponent.handlerPerMsg[msg.name];
    if (!handler) this.msgSent.emit(msg);
  }
  
  sendMsg(name:string, content?:any){ // TODO Should become a shared method between components.
    const msg = <Message>{name, content};
    this.msgSent.emit(msg);
  }
  
  static readonly handlerPerMsg: HandlerPerMsg = {};
}
