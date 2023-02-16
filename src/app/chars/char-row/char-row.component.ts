import { Component, Input } from '@angular/core';
import { Router } from "@angular/router";

import { StateService } from 'src/app/services/state.service';
import { Char } from 'src/app/interfaces/Char';

@Component({
  selector: 'app-char-row',
  templateUrl: './char-row.component.html',
  styleUrls: ['./char-row.component.css']
})
export class CharRowComponent {
  @Input() char:Char = {} as Char;
  
  constructor(private router:Router, private stateService:StateService){
    console.log(this.char);
  }
  
  //==== DOM Events ====
  
  onClick(evt:MouseEvent){
    this.displayCharPage();
  }
  
  //==== Methods ====
  
  displayCharPage(){
    this.stateService.updateSelectedChar(this.char);
    this.router.navigate(['char']);
  }
}
