import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Char } from 'src/app/interfaces/Char';
import { Message } from 'src/app/interfaces/Message';

@Component({
  selector: 'app-char-row',
  templateUrl: './char-row.component.html',
  styleUrls: ['./char-row.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharRowComponent {
  @Input() char = <Char>{};
  @Output() msgSent = new EventEmitter<Message>();
  
  constructor(){}
  
  //==== DOM Events ====
  
  onClick(evt:MouseEvent){
    this.sendMsg('charSelected', this.char);
  }
  
  //==== Messaging ====
  
  sendMsg(name:string, content?:any){
    const msg = <Message>{name, content};
    this.msgSent.emit(msg);
  }
}
