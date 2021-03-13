import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import { ConfigService } from './config.service';
import { Router } from '../../../node_modules/@angular/router';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseApiUrl = environment.BASE_API_URL;
  private autoLogin = this.baseApiUrl + '/registration/auto-login';
  private authenticated: boolean = false;
  onDestroy: Subject<void> = new Subject<void>();
  activated: Subscription;
  constructor(private http: HttpClient, private userService: UserService, private configService: ConfigService, private router: Router) { }


  isAuthenticated(): Observable<boolean> {
    if (this.userService.userId) {
      return Observable.of(true);
    } else {
      return this.loadConfigurationData();
    }
  }




  loadConfigurationData(): Observable<boolean> {
    return this.http.get<any>(this.autoLogin).pipe(map(res => {
      this.setUserDetails(res);
      return true;
    }))
  }

  setUserDetails(data) {
    this.userService.userId = data.userId;
    this.userService.username = data.userName;
    this.userService.updateUser(data.userId);
    this.configService.setSessionStorage(data.userId.toString());
  }


  isAuthenticaedFacebook(): Observable<boolean> {
    console.log("in facebook2");
    var index = this.router.url.indexOf("code");
    if (index != -1) {
      console.log("in facebook3");
      var facebookLoginCode = this.router.url.substring(index + 5);
      this.userService.loginWithFacebook(facebookLoginCode).pipe(map(res => {
        console.log("in facebook4");
        this.userService.userId = res.userId;
        this.userService.username = res.username;
        this.userService.updateUser(res.userId);
        this.configService.setSessionStorage(res.userId.toString());
        return true;
      }))
    }
    return Observable.of(false);
  }
}
