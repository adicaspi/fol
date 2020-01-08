import { Injectable, Injector, Inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

export interface WindowSize {
  height: number,
  width: number
};

@Injectable({
  providedIn: 'root'
})

export class ConfigService {


  private baseApiUrl = environment.BASE_API_URL;
  private autoLogin = this.baseApiUrl + '/registration/auto-login';
  constructor(
    private userService: UserService,
    private http: HttpClient,
    private injector: Injector,

    @Inject('windowObject') private window: Window

  ) {
    Observable.fromEvent(window, 'resize')
      .auditTime(100)
      .map(event => <WindowSize>{
        width: window.innerWidth,
        height: window.innerHeight
      })
      .subscribe((windowSize) => {
        this.windowSizeChanged.next(windowSize);
      })
  };

  readonly windowSizeChanged = new BehaviorSubject<WindowSize>(<WindowSize>{
    width: this.window.innerWidth,
    height: this.window.innerHeight
  });

  router(): Router {
    //this creates router property on your service.
    return this.injector.get(Router);
  }

  setSessionStorage(userId) {
    if (typeof Storage !== 'undefined') {
      sessionStorage.setItem('user_id', userId);
    } else {
      alert('no session storgae');
    }
  }

  getSessionStorgae() {
    const user_id = sessionStorage.getItem('user_id');
    if (user_id) {
      var userId = parseInt(user_id);
      this.userService.userId = userId;
      this.userService.updateUser(userId);
    } else {
      console.log('session storage not initiliazed yet');
    }
  }

  setProductSession(postId) {
    if (typeof Storage !== 'undefined') {
      sessionStorage.setItem('product_id', postId);
    } else {
      alert('no session storgae');
    }
  }

  getProductSession() {
    const product_id = sessionStorage.getItem('product_id');
    if (product_id) {
      var productId = parseInt(product_id);
      return product_id;
    }
  }
}

