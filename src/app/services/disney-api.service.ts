import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DisneyAPIService{
  constructor(private http:HttpClient){}
  
  static readonly baseUrl = 'https://api.disneyapi.dev';
  static readonly baseUrlPage = DisneyAPIService.baseUrl + '/' +'characters?page=';
  static readonly baseUrlSearch = DisneyAPIService.baseUrl + '/' +'character?';
  static readonly resultsNumPerPage = 50;
  
  getCharsPage(pageIndex:number){
    const url = DisneyAPIService.baseUrlPage + pageIndex;
    return this.http.get(url);
  }
  
  getSearchCharsPage(query:string){
    const url = DisneyAPIService.baseUrlSearch + query;
    return this.http.get(url);
  }
}
