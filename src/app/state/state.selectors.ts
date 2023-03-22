import { createSelector } from '@ngrx/store';

import { AppState, CharsState } from '../Types';

// TODO All the exported consts should start with `selector` and not `select` (the latter is for actions).

export const selectCharsState = (state:AppState)=>state.charsState;

export const selectChars = createSelector(
  selectCharsState,
  (state:CharsState)=>state.chars
);

export const selectCharsMode = createSelector(
  selectCharsState,
  (state:CharsState)=>state.charsMode
);

export const selectCharsPage = createSelector(
  selectCharsState,
  (state:CharsState)=>state.charsPage
);

export const selectInitialResultsNumPerPage = createSelector(
  selectCharsState,
  (state:CharsState)=>state.initialResultsNumPerPage
);

export const selectNameTitlePrefix = createSelector(
  selectCharsState,
  (state:CharsState)=>state.nameTitlePrefix
);

export const selectNextPageBtnState = createSelector(
  selectCharsState,
  (state:CharsState)=>state.nextPageBtnState
);

export const selectPageIndex = createSelector(
  selectCharsState,
  (state:CharsState)=>state.pageIndex
);

export const selectPrevPageIndex = createSelector(
  selectCharsState,
  (state:CharsState)=>state.prevPageIndex
);

export const selectResultsIndexes = createSelector(
  selectCharsState,
  (state:CharsState)=>state.resultsIndexes
);

export const selectResultsNumPerPage = createSelector(
  selectCharsState,
  (state:CharsState)=>state.resultsNumPerPage
);

export const selectSearchChars = createSelector(
  selectCharsState,
  (state:CharsState)=>state.searchChars
);

export const selectSearchCharsPage = createSelector(
  selectCharsState,
  (state:CharsState)=>state.searchCharsPage
);

export const selectSelChar = createSelector(
  selectCharsState,
  (state:CharsState)=>state.selChar
);

export const selectSortingMode = createSelector(
  selectCharsState,
  (state:CharsState)=>state.sortingMode
);

// Disney API
export const selectLastFetchedPageIndex = createSelector(
  selectCharsState,
  (state:CharsState)=>state.lastFetchedPageIndex
);

export const selectLastRequestedPageIndex = createSelector(
  selectCharsState,
  (state:CharsState)=>state.lastRequestedPageIndex
);

export const selectMaxRequestedPageIndex = createSelector(
  selectCharsState,
  (state:CharsState)=>state.maxRequestedPageIndex
);

export const selectMaxResultsNum = createSelector(
  selectCharsState,
  (state:CharsState)=>state.maxResultsNum
);

export const selectResultsNum = createSelector(
  selectCharsState,
  (state:CharsState)=>state.resultsNum
);

export const selectTotalPages = createSelector(
  selectCharsState,
  (state:CharsState)=>state.totalPages
);
