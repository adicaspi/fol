import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import { ConfigService } from './config.service';
import { Router } from '../../../node_modules/@angular/router';
import { takeUntil } from 'rxjs/operators';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseApiUrl = environment.BASE_API_URL;
  private autoLogin = this.baseApiUrl + '/registration/auto-login';
  private authenticated: boolean = false;
  private facebookLogin = environment.loginWithFbUrl;
  onDestroy: Subject<void> = new Subject<void>();
  activated: Subscription;
  constructor(private http: HttpClient, private userService: UserService, private configService: ConfigService, private router: Router, private analyticsService: AnalyticsService) { }


  isAuthenticated(): Observable<boolean> {
    console.log("is authenitcated");
    if (this.userService.userId) {
      return Observable.of(true);
    } else {
      return this.loadConfigurationData();
    }
  }

  loadConfigurationData(): Observable<boolean> {
    return this.http.get<any>(this.autoLogin).pipe(map(res => {
      this.analyticsService.reportSignIn(res, true, false);
      this.setUserDetails(res);
      return true;
    }, error => {
      console.log(error);
      this.router.navigate['landing'];
      return false;
    }))
  }

  setUserDetails(data) {
    this.userService.userId = data.userId;
    this.userService.username = data.userName;
    this.userService.updateUser(data.userId);
    this.configService.setSessionStorage(data.userId.toString());
    this.configService.setUserRegionFromDTO(data.region);
  }


  isAuthenticaedFacebook(): Observable<boolean> {
    if (this.userService.userId) {
      return Observable.of(true);
    }
    var index = this.router.url.indexOf("code");
    console.log("router", this.router.url);
    console.log("im index", index);
    var alreadyFoundOnFBError = this.router.url.includes("error_description=Already%20found%20an%20entry%20for%20username%20Facebook");
    if (alreadyFoundOnFBError) {
      console.log("in facebook error");
      this.redirectToFacebook();
    }
    if (index != -1) {
      var facebookLoginCode = this.router.url.substring(index + 5);
      var hashTagIndex = this.router.url.indexOf("#");
      if (hashTagIndex != -1) {
        facebookLoginCode = this.router.url.substring(index + 5, hashTagIndex);
      }
      console.log("in facebook");
      this.loginWithFacebook(facebookLoginCode);
      return Observable.of(true);
    }
    else {
      console.log("in load configuration");
      return this.loadConfigurationData();
    }
  }

  redirectToFacebook() {
    window.location.href = this.facebookLogin;
  }

  loginWithFacebook(code) {
    this.userService.loginWithFacebook(code).pipe(takeUntil(this.onDestroy)).subscribe(data => {
      this.setUserDetails(data);
      this.analyticsService.reprotFacebook(data);
    })
  }

}
