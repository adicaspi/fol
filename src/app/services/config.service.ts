import { Injectable, Injector } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor(private userService: UserService, private injector: Injector) {}

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
