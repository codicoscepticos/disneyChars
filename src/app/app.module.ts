import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HighchartsChartModule } from 'highcharts-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CharsComponent } from './chars/chars.component';
import { CharRowComponent } from './chars/char-row/char-row.component';
import { CharComponent } from './chars/char/char.component';

@NgModule({
  declarations: [
    AppComponent,
    CharsComponent,
    CharRowComponent,
    CharComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    HighchartsChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
