import { Component, OnInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { UserService } from '../../services/user.service';
import { AnalyticsService } from '../../services/analytics.service';
import { ConfigService } from '../../services/config.service';
import { environment } from '../../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-method',
  templateUrl: './login-method.component.html',
  styleUrls: ['./login-method.component.scss']
})
export class LoginMethodComponent implements OnInit {
  userId: boolean = false;
  private baseApiUrl = environment.BASE_API_URL;
  private facebookLogin = environment.loginWithFbUrl;
  private autoLogin = this.baseApiUrl + '/registration/auto-login';
  onDestroy: Subject<void> = new Subject<void>();


  constructor(
    private router: Router,
    private userService: UserService,
    private analyticsService: AnalyticsService,
    private configService: ConfigService,
    private http: HttpClient
  ) {

  }

  ngOnInit() {
    this.loginMethod();
  }

  loginMethod() {
    var index = this.router.url.indexOf("code");
    var alreadyFoundOnFBError = this.router.url.includes("error_description=Already%20found%20an%20entry%20for%20username%20Facebook");

    if (index != -1) {
      var facebookLoginCode = this.router.url.substring(index + 5);
      var hashTagIndex = this.router.url.indexOf("#");
      if (hashTagIndex != -1) {
        facebookLoginCode = this.router.url.substring(index + 5, hashTagIndex);
      }
      this.loginWithFacebook(facebookLoginCode);

    } else if (alreadyFoundOnFBError) {
      console.log("in facebook error");
      this.redirectToFacebook();
    } else { //only try this if user didn't login with facebook

      if (this.userService.userId) {
        this.userId = true;
        var data = {
          username: this.userService.username
        }
        this.analyticsService.reportSignIn(data, true, false);
        this.router.navigate(['feed', this.userService.userId]);
      }
      else {
        console.log("in load configuration");
        this.loadConfigurationData();
      }
    }

  }

  loginWithFacebook(code) {
    //this.configService.setUserRegionFromIP();
    this.userService.loginWithFacebook(code).pipe(takeUntil(this.onDestroy)).subscribe(data => {
      this.analyticsService.prevPage = "Landing Page";
      if (data.new) {
        this.analyticsService.currPage = "Register Page";
      } else {
        this.analyticsService.currPage = "Login Page";
      }

      this.setUserDetails(data);
      this.analyticsService.reprotFacebook(data);
      this.router.navigate(['feed', data.userId]);
    })

  }

  redirectToFacebook() {
    window.location.href = this.facebookLogin;
  }

  loadConfigurationData() {
    this.http.get<any>(this.autoLogin).pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.setUserDetails(data, this.autoLogin);
        this.analyticsService.reportSignIn(data, true, false);
      }, error => {
        this.router.navigate['landing'];
        console.log(error);
      })
  }

  setUserDetails(data, autologin?) {
    this.userId = true;
    this.userService.userId = data.userId;
    this.userService.username = data.userName;
    this.userService.updateUser(data.userId);
    this.configService.setSessionStorage(data.userId.toString());
    this.configService.setUserRegionFromDTO(data.region);
  }




}
