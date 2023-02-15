import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Char } from 'src/app/interfaces/Char';

@Component({
  selector: 'app-char',
  templateUrl: './char.component.html',
  styleUrls: ['./char.component.css']
})
export class CharComponent {
  char:Char = {} as Char;
  
  constructor(private router:Router){
    const nav = this.router.getCurrentNavigation();
    if (nav) this.char = nav.extras.state?.['char'];
  }
}
