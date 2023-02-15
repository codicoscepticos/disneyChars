import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DisneyAPIService {
  constructor(private http:HttpClient) { }
  
  getCharsPage(){
    return this.http.get('https://api.disneyapi.dev/characters');
  }
}
