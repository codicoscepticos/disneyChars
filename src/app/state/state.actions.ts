import { createAction, props } from '@ngrx/store';

import { CharsState, Page, SearchPage } from '../Types';

export const displayNextPage = createAction('[Chars] Display Next Page');
export const displayPrevPage = createAction('[Chars] Display Previous Page');
export const searchResults = createAction('[Chars] Search Results');
// export const selectResultsNum = createAction('[Chars] Select Results Num');
export const sortByName = createAction('[Chars] Sort By Name');

export const displayCharPage = createAction('[Char Row] Display Char Page');

export const fetchCharsPage = createAction(
    '[Disney API] Fetch Characters Page',
    props<{ pageIndex:number }>()
);
export const succeedFetchingCharsPage = createAction(
    '[Disney API] Succeed Fetching Chars Page',
    props<{ charsPage:Page }>()
);
export const failFetchingCharsPage = createAction(
    '[Disney API] Fail Fetching Chars Page',
    props<{ error:string }>()
);

export const fetchSearchCharsPage = createAction(
    '[Disney API] Fetch Characters Page For Search',
    props<{ query:string }>()
);
export const succeedFetchingSearchCharsPage = createAction(
    '[Disney API] Succeed Fetching Chars Page For Search',
    props<{ searchCharsPage:SearchPage }>()
);
export const failFetchingSearchCharsPage = createAction(
    '[Disney API] Fail Fetching Chars Page For Search',
    props<{ error:string }>()
);

export const mergeChars = createAction(
  '[Chars] Merging',
  props<{chars:CharsState['chars']}>()
);

export const nameClicked = createAction('[Chars] On Name Clicked');
export const sortResultsIndexes = createAction('[Chars] Sort Results Indexes');
export const updateMaxResultsNum = createAction('[Chars] Update maxResultsNum');
export const updateNextPageBtnState = createAction('[Chars] Update NextPageBtn State');

export const updateLastFetchedPageIndex = createAction(
  '[Chars] Update lastFetchedPageIndex',
  props<{lastFetchedPageIndex:CharsState['lastFetchedPageIndex']}>()
);

export const updateMaxRequestedPageIndex = createAction(
  '[Chars] Update maxRequestedPageIndex',
  props<{maxRequestedPageIndex:CharsState['maxRequestedPageIndex']}>()
);

export const updatePageIndex = createAction(
  '[Chars] Update pageIndex',
  props<{pageIndex:CharsState['pageIndex']}>()
);

export const updateResultsIndexes = createAction(
  '[Chars] Update resultsIndexes',
  props<{resultsIndexes:CharsState['resultsIndexes']}>()
);

export const updateResultsNum = createAction(
  '[Chars] Update resultsNum',
  props<{resultsNum:CharsState['resultsNum']}>()
);

export const updateResultsNumPerPage = createAction(
  '[Chars] Update resultsNumPerPage',
  props<{resultsNumPerPage:CharsState['resultsNumPerPage']}>()
);

export const updateSearchChars = createAction(
  '[Chars] Update searchChars',
  props<{searchChars:CharsState['searchChars']}>()
);

export const updateSelChar = createAction(
  '[Chars] Update selChar',
  props<{selChar:CharsState['selChar']}>()
);

export const updateTotalPages = createAction(
  '[Chars] Update totalPages',
  props<{totalPages:CharsState['totalPages']}>()
);

// Search

export const searchInputCleared = createAction('[Search] On Search Input Cleared');
export const searchInputSubmitted = createAction('[Search] On Search Input Submitted');
