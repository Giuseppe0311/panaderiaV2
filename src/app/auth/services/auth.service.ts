import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  tap,
  throwError,
} from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserLoginOn = new BehaviorSubject<boolean>(false);
  currentUserData = new BehaviorSubject<any>('');

  constructor(private http: HttpClient) {
    if (this.isBrowser()) {
      this.currentUserLoginOn.next(sessionStorage.getItem('token') != null);
      this.currentUserData.next(sessionStorage.getItem('datos') || '');
    }
  }

  login(usuario: string, contrasena: string): Observable<any> {
    return this.http
      .post('http://panaderia.spring.informaticapp.com:8081/api/auth/login', { usuario, contrasena })
      .pipe(
        tap((data: any) => {
          if (this.isBrowser()) {
            sessionStorage.setItem('token', data.token); // Asumiendo que data.token contiene tu token
            this.currentUserLoginOn.next(true);
            this.decodeToken();
          }
        }),
        map((data: any) => {
          return data;
        }),
        catchError((err) => {
          console.log(err);
          return throwError(err);
        })
      );
  }
  register(data: any): Observable<any> {
    return this.http.post('http://panaderia.spring.informaticapp.com:8081/api/auth/register', data).pipe(
      catchError((err) => {
        console.log(err);
        // Envuelve el error en un Observable para que pueda ser manejado por los suscriptores.
        return throwError(err);
      })
    );
  }

  decodeToken(): any {
    if (this.isBrowser()) {
      const token = sessionStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        console.log(decoded);
        this.currentUserData.next(decoded);
        return decoded;
      }
    }
    return null;
  }
  public getToken(): string | null {
    return this.isBrowser() ? sessionStorage.getItem('token') : null;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }
  //logout
  logout(): void {
    if (this.isBrowser()) {
      sessionStorage.removeItem('token');
      this.currentUserLoginOn.next(false);
      this.currentUserData.next('');
    }
  }
}
