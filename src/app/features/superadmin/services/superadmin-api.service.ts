import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperadminApiService {

  private apiurl_user = 'http://localhost:8081/api/user'  
  private apiurl_admin = 'http://localhost:8081/api/admin'  

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
    return this.httpclient.get<any[]>(`${this.apiurl_user}/${entidad}`, { params });
  }
  postDataformdata(entidad:string,x:FormData){
    return this.httpclient.post(`${this.apiurl_admin}/${entidad}`,x);
  }
  updateDataFormdata(entidad:string,id:number,x:FormData){
    return this.httpclient.put(`${this.apiurl_admin}/${entidad}/${id}`,x);
  }
  deleteData(entidad:string,id:number){
    return this.httpclient.delete(`${this.apiurl_admin}/${entidad}/${id}`);
  }
}
