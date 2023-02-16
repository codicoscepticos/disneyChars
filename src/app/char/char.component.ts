import { Component } from '@angular/core';

import { StateService } from '../services/state.service';
import { Char } from 'src/app/interfaces/Char';

@Component({
  selector: 'app-char',
  templateUrl: './char.component.html',
  styleUrls: ['./char.component.css']
})
export class CharComponent {
  constructor(private stateService:StateService){}
  
  char:Char = this.stateService.getSelectedChar();
}
