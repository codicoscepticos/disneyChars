import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Char } from 'src/app/interfaces/Char';

@Component({
  selector: 'app-char',
  templateUrl: './char.component.html',
  styleUrls: ['./char.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharComponent {
  @Input() char = <Char>{};
  
  constructor(){}
}
