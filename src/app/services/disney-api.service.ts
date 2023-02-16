import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DisneyAPIService{
  constructor(private http:HttpClient){}
  
  static readonly baseUrl = 'https://api.disneyapi.dev/characters?page=';
  static readonly resultsNumPerPage = 50;
  
  getCharsPage(pageIndex:number){
    const url = DisneyAPIService.baseUrl + pageIndex;
    return this.http.get(url);
  }
}
