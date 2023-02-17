import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HighchartsChartModule } from 'highcharts-angular';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';

import { CharsComponent } from './chars/chars.component';
import { CharRowComponent } from './chars/char-row/char-row.component';
import { CharComponent } from './char/char.component';

import { charsPageReducer } from './state/state.reducers';
import { CharsPageEffects } from './state/state.effects';

import { DisneyAPIService } from './services/disney-api.service';
import { MessengerService } from './services/messenger.service';

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
    HighchartsChartModule,
    StoreModule.forRoot({ charsPage: charsPageReducer }),
    EffectsModule.forRoot([CharsPageEffects])
  ],
  providers: [DisneyAPIService, MessengerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
