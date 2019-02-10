import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';
import { map } from '../../../node_modules/rxjs/operators';
import { pipe } from '../../../node_modules/rxjs';

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
    return this.authService.isAuthenticated();
  }
}
