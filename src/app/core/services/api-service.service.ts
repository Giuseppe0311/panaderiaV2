import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export enum ApiType {
  User = 'user',
  Admin = 'admin',
  Superadmin='superadmin',
  Public = 'public',
  AdminSucursal='adminSucursal'
}

@Injectable({
  providedIn: 'root'
})
export class  ApiServiceService {
  
  private baseUrls = {
    user: 'http://panaderia.spring.informaticapp.com:9595/api/user', 
    admin: 'http://panaderia.spring.informaticapp.com:9595/api/admin',
    public: 'http://panaderia.spring.informaticapp.com:9595/api/public',
    superadmin: 'http://panaderia.spring.informaticapp.com:9595/api/superadmin',
    adminSucursal:'http://panaderia.spring.informaticapp.com:9595/api/adminsucursal', 
  }

  constructor(private httpclient : HttpClient) {}
  private getBaseUrl (apiType: ApiType): string {
    return this.baseUrls[apiType];
  }
  getData(apiType: ApiType, entidad: string, queryParams?: { [key: string]: any }): Observable<any> {
    let params = new HttpParams();
    if (queryParams) {
      Object.keys(queryParams).forEach(key => {
        params = params.append(key, queryParams[key]);
      });
    }
    return this.httpclient.get<any[]>(`${this.getBaseUrl(apiType)}/${entidad}`, { params });
  }
  //FORMDATA
  postDataformdata(apiType:ApiType,entidad:string,x:FormData){
    return this.httpclient.post(`${this.getBaseUrl(apiType)}/${entidad}`,x);
  }
  updateDataFormdata(apiType:ApiType,entidad:string,id:number,x:FormData){
    return this.httpclient.put(`${this.getBaseUrl(apiType)}/${entidad}/${id}`,x);   
  }
  //JSON

  postData(ApiType:ApiType,entidad:string,x:any){
    return this.httpclient.post(`${this.getBaseUrl(ApiType)}/${entidad}`,x);
  }
  updateData(ApiType:ApiType,entidad:string,id:number,x:any){
    return this.httpclient.put(`${this.getBaseUrl(ApiType)}/${entidad}/${id}`,x);
  }
  deleteData(ApiType:ApiType,entidad:string,id:number){
    return this.httpclient.delete(`${this.getBaseUrl(ApiType)}/${entidad}/${id}`);
  }


  // }   
  // getData(entidad: string, queryParams?: {[key: string]: any}): Observable<any> {
  //   let params = new HttpParams();
  //   if (queryParams) {
  //     for (let key in queryParams) {
  //       if (queryParams.hasOwnProperty(key)) {
  //         params = params.append(key, queryParams[key]);
  //       }
  //     }
  //   }
  //   return this.httpclient.get<any[]>(`${this.apiurl_user}/${entidad}`, { params });
  // }
  // postDataformdata(entidad:string,x:FormData){
  //   return this.httpclient.post(`${this.apiurl_admin}/${entidad}`,x);
  // }
  // updateDataFormdata(entidad:string,id:number,x:FormData){
  //   return this.httpclient.put(`${this.apiurl_admin}/${entidad}/${id}`,x);
  // }
  // deleteData(entidad:string,id:number){
  //   return this.httpclient.delete(`${this.apiurl_admin}/${entidad}/${id}`);
  // }
  // //
  // postData(entidad:string,x:any){
  //   return this.httpclient.post(`${this.apiurl_admin}/${entidad}`,x);
  // }
  // //
  // updateData(entidad:string,id:number,x:any){
  //   return this.httpclient.put(`${this.apiurl_admin}/${entidad}/${id}`,x);
  
}
