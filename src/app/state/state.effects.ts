import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
    failFetchingCharsPage,
    failFetchingSearchCharsPage,
    fetchCharsPage,
    fetchSearchCharsPage,
    succeedFetchingCharsPage,
    succeedFetchingSearchCharsPage
} from './state.actions';

import { DisneyAPIService } from '../services/disney-api.service';

import { Page, SearchPage } from '../Types';

@Injectable()
export class CharsPageEffects{
    constructor(
        private actions$:Actions,
        private disneyAPIService:DisneyAPIService
    ){}
    
    fetchCharsPage$ = createEffect(()=>
        this.actions$.pipe(
            ofType(fetchCharsPage),
            concatMap(
                ({pageIndex})=>this.disneyAPIService.getCharsPage(pageIndex).pipe(
                    map(charsPage=>succeedFetchingCharsPage({
                        charsPage: <Page>charsPage
                    })),
                    catchError(error=>of(failFetchingCharsPage({ error })))
                )
            )
        )
    );
    
    fetchSearchCharsPage$ = createEffect(()=>
        this.actions$.pipe(
            ofType(fetchSearchCharsPage),
            switchMap(
                ({query})=>this.disneyAPIService.getSearchCharsPage(query).pipe(
                    map(searchCharsPage=>succeedFetchingSearchCharsPage({
                        searchCharsPage: <SearchPage>searchCharsPage
                    })),
                    catchError(error=>of(failFetchingSearchCharsPage({ error })))
                )
            )
        )
    );
}
