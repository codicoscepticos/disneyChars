import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../interfaces/Message';

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
