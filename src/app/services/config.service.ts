import { Injectable, Injector } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { GlobalVariable } from '../../global';
import { HttpClient } from '../../../node_modules/@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  private autoLogin = this.baseApiUrl + '/registration/auto-login';
  constructor(
    private userService: UserService,
    private http: HttpClient,
    private injector: Injector
  ) {}

  router(): Router {
    //this creates router property on your service.
    return this.injector.get(Router);
  }

  setSessionStorage(userId) {
    if (typeof Storage !== 'undefined') {
      console.log('setting session storgae', userId);
      sessionStorage.setItem('user_id', userId);
    } else {
      alert('no session storgae');
    }
  }

  getSessionStorgae() {
    const user_id = sessionStorage.getItem('user_id');
    if (user_id) {
      var userId = parseInt(user_id);
      console.log('at session storage user ID is', userId);
      this.userService.userId = userId;
      this.userService.updateUser(userId);
    } else {
      console.log('session storage not initiliazed yet');
    }
  }
}
