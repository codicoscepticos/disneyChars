import { createReducer, on } from '@ngrx/store';

import {
    // [Disney API]
    failFetchingCharsPage,
    failFetchingSearchCharsPage,
    fetchCharsPage,
    fetchSearchCharsPage,
    succeedFetchingCharsPage,
    succeedFetchingSearchCharsPage,
    // [Chars]
    displayNextPage,
    displayPrevPage,
    searchResults,
    selectResultsNum,
    sortByName,
    // [Char Row]
    displayCharPage
} from './state.actions';

import { Page } from '../interfaces/Page';
import { SearchPage } from '../interfaces/SearchPage';

export const initState:Page = {
    count: 0,
    data: [],
    nextPage: '',
    prevPage: '',
    totalPages: 0
};
export const charsPageReducer = createReducer(
    initState,
    // [Chars]
    on(displayNextPage, (state)=>state),
    on(displayPrevPage, (state)=>state),
    on(searchResults, (state)=>state),
    on(selectResultsNum, (state)=>state),
    on(sortByName, (state)=>state),
    // [Char Row]
    on(displayCharPage, (state)=>state),
    // [Disney API]
    on(fetchCharsPage, (state)=>state),
    on(succeedFetchingCharsPage, (state, { charsPage })=><Page>charsPage),
    on(failFetchingCharsPage, (state)=>state)
);

export const initSearchPageState:SearchPage = {
    count: 0,
    data: []
};
export const searchCharsPageReducer = createReducer(
    initSearchPageState,
    // [Disney API]
    on(fetchSearchCharsPage, (state)=>state),
    on(succeedFetchingSearchCharsPage, (state, { searchCharsPage })=><SearchPage>searchCharsPage),
    on(failFetchingSearchCharsPage, (state)=>state)
);
