import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Char, HandlerPerMsg, Message } from '../Types';

@Component({
  selector: 'app-chars',
  templateUrl: './chars.component.html',
  styleUrls: ['./chars.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharsComponent {
  @Input() chars$ = new BehaviorSubject<Char[]>([]);
  @Input() initialResultsNumPerPage:number = 50;
  @Input() nameTitlePrefix:string = '';
  @Input() nextPageBtnState:string = 'enabled';
  @Input() pageIndex:number = 1; // NOTE Changes according if going to prev or next page.
  @Input() resultsIndexes:number[] = [];
  
  @Output() msgSent = new EventEmitter<Message>();
  
  constructor(){}
  
  readonly headerCellNames = ['Name', '# TV Shows', '# Video Games', 'Allies', 'Enemies'];
  readonly selectorOptions:number[] = [10, 20, 50, 100, 200, 500];
  
  ngOnInit(){}
  
  //==== DOM Events ====
  
  onNameClick(evt:MouseEvent){
    this.sendMsg('nameClicked');
  }
  
  onOptionChanged(newResultsNumPerPage:number){
    this.sendMsg('resultsNumPerPageChanged', newResultsNumPerPage);
  }
  
  onPageByDiff(diff:number){
    this.sendMsg('pageTurned', diff);
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
