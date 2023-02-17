import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { Page } from '../interfaces/Page';

import { DisneyAPIService } from '../services/disney-api.service';
import { fetchCharsPage, succeedFetchingCharsPage, failFetchingCharsPage } from './state.actions';

@Injectable()
export class CharsPageEffects{
    constructor(
        private actions$:Actions,
        private disneyAPIService:DisneyAPIService
    ){}
    
    fetchCharsPage$ = createEffect(()=>
        this.actions$.pipe(
            ofType(fetchCharsPage),
            mergeMap(
                ({pageIndex})=>this.disneyAPIService.getCharsPage(pageIndex).pipe(
                    map(charsPage=>succeedFetchingCharsPage({ charsPage:<Page> charsPage })),
                    catchError(error=>of(failFetchingCharsPage({ error })))
                )
            )
        )
    );
}
