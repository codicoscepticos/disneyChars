import { Component, Input } from '@angular/core';
import { Char } from 'src/app/interfaces/Char';
import { Router } from "@angular/router";

@Component({
  selector: 'app-char-row',
  templateUrl: './char-row.component.html',
  styleUrls: ['./char-row.component.css']
})
export class CharRowComponent {
  @Input() char:Char = {} as Char;
  
  constructor(private router:Router){
    console.log(this.char);
  }
  
  displayCharPage(){
    const extras = {state: {char: this.char}};
    this.router.navigate(['char'], extras);
  }
}
