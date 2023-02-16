import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Char } from '../interfaces/Char';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private chars$ = new BehaviorSubject<Char[]>([]);
  
  getChars(){
    return this.chars$;
  }
}
