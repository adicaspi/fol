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

  setGeneralSession(key, val) {
    if (typeof Storage !== 'undefined') {
      sessionStorage.setItem(key, val);
    } else {
      alert('no session storgae');
    }
  }

  getGeneralSession(key) {
    const res = sessionStorage.getItem(key);
    if (res) {
      var val = parseInt(res);
      return val;
    }
  }

  iOS() {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
      // iPad on iOS 13 detection
      || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  }
}

