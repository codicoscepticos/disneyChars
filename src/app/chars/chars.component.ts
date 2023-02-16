import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Char } from '../interfaces/Char';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-chars',
  templateUrl: './chars.component.html',
  styleUrls: ['./chars.component.css']
})
export class CharsComponent {
  constructor(private stateService:StateService){}
  
  pageNum:number = 1;
  resultsNum:number = 50;
  readonly resultsNumPerPage:number = 50;
  
  chars$:BehaviorSubject<Char[]> = this.stateService.getChars();
  resultsIndexes:null[] = Array(this.resultsNum).fill(null);
}
