import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { Subscription, Observable } from '../../../node_modules/rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  activated: boolean = false;
  subscriptipn: Subscription

  constructor(public auth: AuthService, public router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (next.routeConfig.path == "profile/:id") {
      if (next.params.id) {
        localStorage.setItem('profile', next.params.id);
      }
    }
    return this.auth.isAuthenticated().pipe(map(res => {
      if (res) {
        return true;
      } else {
        return false;
      }
    }));




    // if (this.auth.isAuthenticated()) {
    //   console.log("in isAuthenticated true");
    //   return true;
    // } else {
    //   this.router.navigate(['/landing']);
    //   console.log("in isAuthenticated false");
    //   return false;
    // }
  }
}



