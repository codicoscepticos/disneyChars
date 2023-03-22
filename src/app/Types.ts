export interface AppState{
  charsState:CharsState
}

export interface Char{
  _id:number,
  alignment:string,
  allies:string[],
  enemies:string[],
  films:string[],
  imageUrl:string,
  name:string,
  parkAttractions:string[],
  shortFilms:string[],
  sourceUrl:string,
  tvShows:string[],
  url:string,
  videoGames:string[],
}

export type CharsMode = 'default' | 'search';

export interface CharsState{ // TODO To be used.
  chars:Char[],
  charsMode:CharsMode,
  charsPage:Page,
  initialResultsNumPerPage:number,
  nameTitlePrefix:string,
  nextPageBtnState:string,
  pageIndex:number,
  prevPageIndex:number,
  resultsIndexes:number[],
  resultsNumPerPage:number,
  searchChars:Char[],
  searchCharsPage:SearchPage,
  selChar:Char|undefined,
  sortingMode:SortingMode,
  // Disney API
  lastFetchedPageIndex:number,
  lastRequestedPageIndex:number,
  maxRequestedPageIndex:number,
  maxResultsNum:number,
  resultsNum:number,
  totalPages:number
}

export interface HandlerPerMsg{
  [key:string]: string | Function
}

export interface Message{
  name:string,
  content:any
}

export interface Page{
  count:number,
  data:Char[],
  nextPage:string,
  prevPage:string,
  totalPages:number
}

export interface SearchPage{
  count:number,
  data:Object[]
}

export type SortingMode = 'ascending' | 'descending' | 'original';
