import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Char } from '../interfaces/Char';
import { Page } from '../interfaces/Page';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-chars',
  templateUrl: './chars.component.html',
  styleUrls: ['./chars.component.css']
})
export class CharsComponent {
  pageNum:number = 1;
  resultsNum:number = 50;
  readonly resultsNumPerPage:number = 50;
  
  chars$:Observable<Char[]> = this.stateService.getChars();
  resultsIndexes:null[] = Array(this.resultsNum).fill(null);
  
  constructor(private stateService:StateService){}
  
  // addChar(data: Object){
  //   this.chars.push(data as Char);
  // }
  
  // addChars(data: Object){
  //   const page = (data as Page);
  //   page.data.forEach(this.addChar, this);
    
  //   console.log(this.chars);
  // }
  
  // getChars(){
  //   const addChars = this.addChars.bind(this);
  //   this.disneyApi.getChars().subscribe(addChars);
  // }
}
