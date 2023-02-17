import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Char } from 'src/app/interfaces/Char';
import { Message } from 'src/app/interfaces/Message';

@Component({
  selector: 'app-char-row',
  templateUrl: './char-row.component.html',
  styleUrls: ['./char-row.component.css']
})
export class CharRowComponent {
  @Input() char = <Char>{};
  @Output() onMsg = new EventEmitter<Message>();
  
  constructor(){}
  
  //==== DOM Events ====
  
  onClick(evt:MouseEvent){
    const msg = <Message>{name: 'charSelected', content: this.char};
    this.onMsg.emit(msg);
  }
}
