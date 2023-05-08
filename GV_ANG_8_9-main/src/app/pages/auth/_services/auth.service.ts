import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ENDPOINTS } from '../_config/endpoints';
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  getToken(email, password) {
    return this.http.post( ENDPOINTS.GET_TOKEN, { username: email, password: password } ).pipe(
      map((data)=>{
        return data;
      })
    )
  }
}
