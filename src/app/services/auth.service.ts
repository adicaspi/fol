import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from '../../../node_modules/rxjs/operators';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { throwError } from 'rxjs';
import { nextContext } from '../../../node_modules/@angular/core/src/render3';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private logIns: Subject<boolean> = new ReplaySubject(1);
  constructor(private router: Router, private http: HttpClient) {}

  // get isLoggedIn() {
  //   return this.loggedIn.asObservable();
  // }
  //https://bee372fd-54b0-4b13-a364-7d038c089968.mock.pstmn.io/loggedin
  //'http://sample-env.umnxh3ie2h.us-east-1.elasticbeanstalk.com/user-info/305555/details'
  isAuthenticated(): Observable<any> {
    //const headers = new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest');
    var result;

    try {
      result = this.http
        .get<any>(
          'http://sample-env.umnxh3ie2h.us-east-1.elasticbeanstalk.com/registration/auto-login',
          { observe: 'response' }
        )
        .pipe(
          map(res => {
            if (res.status == 200) {
              console.log('im in res');
              return true;
            }
            if (res.status == 401) {
              return false;
            }
          }),

          catchError(err => {
            console.log('im error');
            throwError('Something bad happened; please try again later.');
            this.logIns.next(false);
            return this.logIns;
          })
        );
    } catch (error) {
      console.log('caught error');
    }
    return result;
  }
}

//pipe(
//   map(
//     res => {
//       this.logIns.next(true);
//       console.log('im in true');
//       return this.logIns;
//     },
//     catchError(err => {
//       //console.log('im error', err);
//       throwError('Something bad happened; please try again later.');
//       this.logIns.next(false);
//       return this.logIns;
//     })
//   )
// );

// catchError(err => {
//   console.log('im error', err);
//   return throwError('Something bad happened; please try again later.');
// })
