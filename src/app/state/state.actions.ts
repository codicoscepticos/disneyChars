import { createAction, props } from '@ngrx/store';
import { Page } from '../interfaces/Page';

export const displayNextPage = createAction('[Chars] Display Next Page');
export const displayPrevPage = createAction('[Chars] Display Previous Page');
export const searchResults = createAction('[Chars] Search Results');
export const selectResultsNum = createAction('[Chars] Select Results Num');
export const sortByName = createAction('[Chars] Sort By Name');

export const displayCharPage = createAction('[Char Row] Display Char Page');

export const fetchCharsPage = createAction('[Disney API] Fetch Characters Page');
export const succeedFetchingCharsPage = createAction(
    '[Disney API] Succeed Fetching Chars Page',
    props<{ charsPage:Page }>()
);
export const failFetchingCharsPage = createAction(
    '[Disney API] Fail Fetching Chars Page',
    props<{ error:string }>()
);

// ==== EVENTS ====
// 1. [Chars] Select number of results
// 	* change table (model)
	
// 2. [Chars] Next page
// 	* change table (model)
	
// 3. [Chars] Previous page
// 	* change table (model)
	
// 4. [Chars] Search/Filter
// 	* change table (model)
	
// 5. [Chars] Click Name category to sort
// 	* change table (model)
	
// 6. [Char-Row] Select/Click a char row
// 	* navigate to char-page (char selected)
