import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Char } from '../interfaces/Char';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private chars$ = of(<Char[]>[]);
  
  getChars(){
    return this.chars$;
  }
  
  setChars(chars$:Observable<Char[]>){
    this.chars$ = chars$;
  }
}
