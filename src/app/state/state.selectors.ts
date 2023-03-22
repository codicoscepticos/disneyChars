import { createSelector } from '@ngrx/store';

import {
  AppState,
  Char,
  CharsState,
  Page,
  SearchPage
} from '../Types';

export const selectCharsState = (state:AppState)=>state.charsState;

export const selectChars = createSelector(
  selectCharsState,
  (state:CharsState):Char[]=>state.chars
);

export const selectCharsPage = createSelector(
  selectCharsState,
  (state:CharsState):Page=>state.charsPage
);

export const selectSearchCharsPage = createSelector(
  selectCharsState,
  (state:CharsState):SearchPage=>state.searchCharsPage
);
