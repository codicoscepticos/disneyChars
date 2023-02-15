import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharComponent } from './char/char.component';
import { CharsComponent } from './chars/chars.component';

const routes: Routes = [
  {path: '', component: CharsComponent},
  {path: 'char', component: CharComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
