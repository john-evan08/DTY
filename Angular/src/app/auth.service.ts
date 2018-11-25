import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { User } from './user';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Data } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Bill } from './bill';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    })
  };

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  authToken: any;
  user: any;

  constructor (private http: HttpClient) { }

  // Register User
  registerUser (user: User): Observable<Data> {
    return this.http.post<Data>('http://localhost:3000/users/register', user, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }
  // Authenticate User
  authenticateUser (user): Observable<Data> {
    return this.http.post<Data>('http://localhost:3000/users/authenticate', user, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  // Go to Profile
  getProfile(): Observable<Data> {
    this.loadToken();
    if (this.authToken) {
      const httpOptions2 = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': this.authToken
        })
      };
    return this.http.get<Data>('http://localhost:3000/users/profile', httpOptions2)
    .pipe(
      catchError(this.handleError)
    );
    } else {
      return this.http.get<Data>('http://localhost:3000/users/profile', httpOptions)
    .pipe(
      catchError(this.handleError)
    );
    }
  }

   // Admin Profile
  getUsers(): Observable<Data> {
    this.loadToken();
    if (this.authToken) {
      const httpOptions2 = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': this.authToken
        })
      };
    return this.http.get<Data>('http://localhost:3000/users/admin/userlist', httpOptions2)
    .pipe(
      catchError(this.handleError)
    );
    } else {
      return this.http.get<Data>('http://localhost:3000/users/admin/userlist', httpOptions)
    .pipe(
      catchError(this.handleError)
    );
    }
  }

  deleteUser(user): Observable<Data> {
    const id: string = user['_id'] ;
    const url = 'http://localhost:3000/users/admin/userlist/' + id;
    this.loadToken();
    if (this.authToken) {
      const httpOptions2 = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': this.authToken
        })
      };
    return this.http.delete<Data>(url, httpOptions2)
    .pipe(
      catchError(this.handleError)
    );
    } else {
      return this.http.delete<Data>(url, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
    }
  }

  adminUser(user): Observable<Data> {
    const id: string = user['_id'] ;
    const url = 'http://localhost:3000/users/admin/userlist/' + id;
    this.loadToken();
    if (this.authToken) {
      const httpOptions2 = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': this.authToken
        })
      };
    return this.http.put<Data>(url, {}, httpOptions2)
    .pipe(
      catchError(this.handleError)
    );
    } else {
      return this.http.put<Data>(url, {}, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
    }
  }

 // User Profile
  addBill(bill: Bill): Observable<Data> {
    this.loadToken();
    if (this.authToken) {
      const httpOptions2 = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': this.authToken
        })
      };
    return this.http.put<Data>('http://localhost:3000/users/profile', bill, httpOptions2)
    .pipe(
      catchError(this.handleError)
    );
    } else {
      return this.http.put<Data>('http://localhost:3000/users/profile', bill, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
    }
  }

  deleteBill(bill): Observable<Data> {
    this.loadToken();
    const id: string = bill['_id'] ;
    const url = 'http://localhost:3000/users/profile/' + id;
    if (this.authToken) {
      const httpOptions2 = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': this.authToken
        })
      };
    return this.http.delete<Data>(url, httpOptions2)
    .pipe(
      catchError(this.handleError)
    );
    } else {
      return this.http.delete<Data>(url, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
    }
  }


  storeUserData(token, user): void {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken(): void {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {

    if (localStorage.id_token === undefined ) {
     return false;
    } else {
    const helper = new JwtHelperService();
    return !(helper.isTokenExpired(localStorage.id_token));
    }
   }


  logout(): void {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
