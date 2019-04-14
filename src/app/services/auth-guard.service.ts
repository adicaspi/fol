import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { map, catchError } from '../../../node_modules/rxjs/operators';
import { pipe } from '../../../node_modules/rxjs';
import { HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  result: boolean;
  constructor(public authService: AuthService, public router: Router) {}

  // canActivate(): Observable<boolean> {
  //   console.log('im answer', this.authService.isAuthenticated());
  //   return this.authService.isAuthenticated();
  // }

  canActivate(): Observable<boolean> {
    console.log('in can activate');
    return this.authService.isAuthenticated().pipe(
      map(
        response => {
          if (response) {
            console.log('in auth gurad im repsonse false', response);
            return false;
          } else {
            console.log('in auth gurad im repsonse true', response);
            return true;
          }
        },
        error => {
          //this.alertService.error(error);
          console.log('im error', error);
        }
      )
    );
  }
}
