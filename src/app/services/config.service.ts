import { Injectable, Injector, Inject, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { PostService } from './post.service';
import { FeedService } from './feed.service';

export interface WindowSize {
  height: number,
  width: number
};

@Injectable({
  providedIn: 'root'
})

export class ConfigService implements OnInit {


  private baseApiUrl = environment.BASE_API_URL;
  private autoLogin = this.baseApiUrl + '/registration/auto-login';
  private region;
  constructor(
    private userService: UserService,
    private feedService: FeedService,
    private postService: PostService,
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

  ngOnInit() {
    this.getSessionStorgae();

  }

  router(): Router {
    //this creates router property on your service.
    return this.injector.get(Router);
  }


  async setUserRegionFromIP(): Promise<string> {
    return this.getLocation().then(country => {
      if (country == "US") {
        this.setGeneralSession("region", "US");
      } else if (country == "IL") {
        this.setGeneralSession("region", "IL");
      } else {
        this.setGeneralSession("region", "US");
      }
      return country;
    });
  }

  setUserRegionFromLocale() {
    let language = navigator.language;
    if ((language == "en") || (language == "en-US")) {
      this.setGeneralSession("region", "US");
    } else if ((language == "he-IL") || (language == "he")) {
      this.setGeneralSession("region", "IL");
    } else {
      this.setGeneralSession("region", "US");
    }


  }

  setUserRegionFromDTO(region) {
    this.setGeneralSession("region", region);
  }

  setSessionStorage(userId) {
    if (typeof Storage !== 'undefined') {
      //sessionStorage.setItem('user_id', userId);
      localStorage.setItem('user_id', userId);
    } else {
      alert('no session storgae');
    }
  }

  getSessionStorgae() {
    // const user_id = sessionStorage.getItem('user_id');
    const user_id = localStorage.getItem('user_id');
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
      //sessionStorage.setItem(key, val);
      localStorage.setItem(key, val);
    }
  }

  removeItem(key) {
    localStorage.removeItem(key);
  }

  getGeneralSession(key) {
    //const res = sessionStorage.getItem(key);
    const res = localStorage.getItem(key);
    if (res) {
      var val = parseInt(res);
      return val;
    }
  }

  getUserRegion(key) {
    const res = localStorage.getItem(key);
    console.log("im res", res);
    if (res) {
      return res;
    }
    return "US"; //defaults to US region
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

  async getLocation(): Promise<string> {
    var token = "f2525502aa8d72";
    const request = await fetch("https://ipinfo.io/json?token=" + token);
    const jsonResponse = await request.json();
    return jsonResponse.country;
  }

}

