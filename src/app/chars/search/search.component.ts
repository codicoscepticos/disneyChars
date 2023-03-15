import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

import { Message } from '../../Types';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
  @Output() msgSent = new EventEmitter<Message>();
  
  constructor(){}
  
  onEnterPressed(evt:Event){
    let value = (evt.currentTarget as HTMLInputElement).value.trim();
    if (!value.includes('=')) value = 'name=' + value;
    
    this.sendMsg('searchInputSubmitted', value);
  }
  
  onInputChanged(evt:Event){
    const value = (evt.currentTarget as HTMLInputElement).value;
    if (!value) this.sendMsg('searchInputCleared');
  }
  
  //==== Messaging ====
  
  sendMsg(name:string, content?:any){
    const msg = <Message>{name, content};
    this.msgSent.emit(msg);
  }
}
