import { createAction, props } from '@ngrx/store';

import { Page, SearchPage } from '../Types';

export const displayNextPage = createAction('[Chars] Display Next Page');
export const displayPrevPage = createAction('[Chars] Display Previous Page');
export const searchResults = createAction('[Chars] Search Results');
export const selectResultsNum = createAction('[Chars] Select Results Num');
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
