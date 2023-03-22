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
    // selectResultsNum,
    sortByName,
    // [Char Row]
    displayCharPage,
    mergeChars,
    sortResultsIndexes,
    searchInputCleared,
    searchInputSubmitted,
    nameClicked,
    updateNextPageBtnState,
    updatePageIndex,
    updateResultsNumPerPage,
    updateResultsIndexes,
    updateSearchChars,
    updateResultsNum,
    updateLastFetchedPageIndex,
    updateTotalPages,
    updateMaxResultsNum,
    updateMaxRequestedPageIndex
} from './state.actions';

import { AppComponent } from '../app.component';
import { DisneyAPIService } from '../services/disney-api.service';
import { CharsState, Page, SearchPage } from '../Types';

export const initState:CharsState = {
  chars: [],
  charsMode: 'default',
  charsPage: <Page>{},
  initialResultsNumPerPage: 50,
  nameTitlePrefix: '',
  nextPageBtnState: 'enabled',
  pageIndex: 1,
  prevPageIndex: 1,
  resultsIndexes: [],
  resultsNumPerPage: 50,
  searchChars: [],
  searchCharsPage: <SearchPage>{},
  selChar: undefined,
  sortingMode: 'original',
  
  // Disney API
  lastFetchedPageIndex: 0,
  lastRequestedPageIndex: 0,
  maxRequestedPageIndex: 0,
  maxResultsNum: Infinity,
  resultsNum: 0,
  totalPages: Infinity
};
export const charsPageReducer = createReducer(
    initState,
    
    // [Chars]
    on(displayNextPage, (state)=>state),
    on(displayPrevPage, (state)=>state),
    on(searchResults, (state)=>state),
    on(sortByName, (state)=>state),
    
    on(mergeChars, (state, {chars})=>({
      ...state,
      chars: [...state.chars, ...chars]
    })),
    
    on(nameClicked, (state)=>{
      let sortingMode = AppComponent.nextSortingModePerCur[state.sortingMode];
      const nameTitlePrefix = AppComponent.prefixPerSortingMode[sortingMode];
      return {
        ...state,
        nameTitlePrefix,
        sortingMode
      };
    }),
    
    on(searchInputCleared, (state)=>({
        ...state,
        charsMode: 'default',
        searchChars: [],
        resultsNum: state.chars.length,
        pageIndex: state.prevPageIndex
    })),
    
    on(searchInputSubmitted, (state)=>({
      ...state,
      charsMode: 'search',
      prevPageIndex: state.pageIndex,
      pageIndex: 1
    })),
    
    on(sortResultsIndexes, (state)=>{
      let resultsIndexes = state.resultsIndexes.slice();
      resultsIndexes.sort(AppComponent.sortingPerMode.ascending.byNumber);
      
      let sortingMode = state.sortingMode;
      if (sortingMode === 'original') return {...state, resultsIndexes};
      
      let chars = (state.charsMode === 'search') ? state.searchChars : state.chars;
      chars = AppComponent.charsByIndexes(chars, resultsIndexes);
      let names = chars.map(char => char.name); // TODO Become method.
      resultsIndexes = resultsIndexes.slice(0, names.length);
      
      const startIndex = resultsIndexes[0];
      resultsIndexes.sort(function(i1:number, i2:number){ // TODO Become method.
        if (startIndex > 0) {
          i1 = i1 % startIndex;
          i2 = i2 % startIndex;
        }
        let name1 = names[i1];
        let name2 = names[i2];
        if (sortingMode === 'descending') {
          const t = name1;
          name1 = name2;
          name2 = t;
        }
        return name1.localeCompare(name2);
      });
      
      return {...state, resultsIndexes};
    }),
    
    on(updateLastFetchedPageIndex, (state, {lastFetchedPageIndex})=>({
      ...state,
      lastFetchedPageIndex
    })),
    
    on(updateMaxRequestedPageIndex, (state, {maxRequestedPageIndex})=>({
      ...state,
      maxRequestedPageIndex
    })),
    
    on(updateMaxResultsNum, (state)=>{
      let maxResultsNum;
      let totalPages = state.totalPages;
      if (totalPages === state.lastFetchedPageIndex) {
        maxResultsNum = state.resultsNum;
      } else {
        maxResultsNum = totalPages * DisneyAPIService.resultsNumPerPage; // TODO Move to ngOnInit
      }
      
      return {
        ...state,
        maxResultsNum
      };
    }),
    
    on(updateNextPageBtnState, (state)=>{
      const maxPageIndex = Math.ceil(state.maxResultsNum / state.resultsNumPerPage);
      const nextPageBtnState = (state.pageIndex < maxPageIndex) ? 'enabled' : 'disabled';
      return {
        ...state,
        nextPageBtnState
      };
    }),
    
    on(updatePageIndex, (state, {pageIndex})=>({
      ...state,
      pageIndex
    })),
    
    on(updateResultsIndexes, (state, {resultsIndexes})=>({
      ...state,
      resultsIndexes
    })),
    
    on(updateResultsNum, (state, {resultsNum})=>({
      ...state,
      resultsNum
    })),
    
    on(updateResultsNumPerPage, (state, {resultsNumPerPage})=>({
      ...state,
      resultsNumPerPage
    })),
    
    on(updateSearchChars, (state, {searchChars})=>({
      ...state,
      searchChars
    })),
    
    on(updateTotalPages, (state, {totalPages})=>({
      ...state,
      totalPages
    })),
    
    // // [Char Row]
    on(displayCharPage, (state)=>state),
    // // [Disney API]
    on(fetchCharsPage, (state)=>({
      ...state,
      lastRequestedPageIndex: state.pageIndex
    })),
    on(succeedFetchingCharsPage, (state, { charsPage })=><Page>charsPage),
    on(failFetchingCharsPage, (state)=>state),
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
