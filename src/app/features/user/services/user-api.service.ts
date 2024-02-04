import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private apiurl = 'http://localhost:8081/api/user'  

  constructor(private httpclient : HttpClient) { 
  }   

  getData(entidad: string, queryParams?: {[key: string]: any}): Observable<any> {
    let params = new HttpParams();
    if (queryParams) {
      for (let key in queryParams) {
        if (queryParams.hasOwnProperty(key)) {
          params = params.append(key, queryParams[key]);
        }
      }
    }
    return this.httpclient.get<any[]>(`${this.apiurl}/${entidad}`, { params });
  }
}
