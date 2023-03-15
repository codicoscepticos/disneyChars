import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Message } from '../Types';

@Injectable()
export class MessengerService{
  private readonly messenger$ = new BehaviorSubject(<Message>{});
  
  getMessenger$(){
    return this.messenger$;
  }
  
  sendMsg(msg:Message){
    this.messenger$.next(msg);
  }
}
