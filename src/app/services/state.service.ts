import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Char } from '../interfaces/Char';

@Injectable()
export class StateService{ // RETHINK Merge with MessengerService?
  private chars$ = new BehaviorSubject<Char[]>([]);
  private selectedChar = <Char>{};
  
  getChars$(){
    return this.chars$;
  }
  
  getSelectedChar(){
    return this.selectedChar;
  }
  
  updateSelectedChar(char:Char){
    this.selectedChar = char;
  }
}
