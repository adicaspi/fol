import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from '../../../node_modules/rxjs/operators';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { throwError } from 'rxjs';

import { GlobalVariable } from '../../global';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  private autoLogin = this.baseApiUrl + '/registration/auto-login';
  private logIns: Subject<boolean> = new ReplaySubject(1);
  constructor(private router: Router, private http: HttpClient) {}

  // get isLoggedIn() {
  //   return this.loggedIn.asObservable();
  // }
  //https://bee372fd-54b0-4b13-a364-7d038c089968.mock.pstmn.io/loggedin
  //'http://sample-env.umnxh3ie2h.us-east-1.elasticbeanstalk.com/user-info/305555/details'
  isAuthenticated(): Observable<any> {
    return this.http.get<any>(this.autoLogin, { observe: 'response' });
  }
}
