import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DisneyAPIService {
  constructor(private http:HttpClient) { }
  
  getChars(){
    return this.http.get('https://api.disneyapi.dev/characters');
  }
}
