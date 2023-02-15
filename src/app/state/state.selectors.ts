import { createSelector } from '@ngrx/store';
import { AppState } from '../interfaces/AppState';

export const selectCharsPage = (state:AppState)=>state.charsPage;

// export const selectCharsPage = createSelector(
//     selectCharsPageState,
//     (state:Page)=>state.data
// )
