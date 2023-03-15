export interface AppState{
  charsPage:Page,
  searchCharsPage:SearchPage
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
  pageIndex:number,
  selChar:null
};

export interface HandlerPerMsg{
  [key:string]: string | Function
}

export interface Message{
  name:string,
  content:any
}

export interface Page{
  count:number,
  data:Object[],
  nextPage:string,
  prevPage:string,
  totalPages:number
}

export interface SearchPage{
  count:number,
  data:Object[]
}

export type SortingMode = 'ascending' | 'descending' | 'original';
