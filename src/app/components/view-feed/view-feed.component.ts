import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { ConfigService } from '../../services/config.service';
import { ErrorsService } from '../../services/errors.service';
import { takeUntil } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { MessageService } from '../../services/message.service';
import { AnalyticsService } from '../../services/analytics.service';
@Component({
  selector: 'app-view-feed',
  templateUrl: './view-feed.component.html',
  styleUrls: ['./view-feed.component.css']
})
export class ViewFeedComponent implements OnInit {
  private baseApiUrl = environment.BASE_API_URL;
  private facebookLogin = environment.loginWithFbUrl;
  private autoLogin = this.baseApiUrl + '/registration/auto-login';
  userId: boolean = false;
  desktop: Boolean = true;
  filteredOptions: Observable<string[]>;
  searchedTouched: Observable<boolean>;
  autologin: boolean = false;
  error: any = {};
  private subscription: Subscription;
  private autoLoginSubscription: Subscription;
  private anyErrors: boolean;
  private finished: boolean;
  onDestroy: Subject<void> = new Subject<void>();
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  constructor(
    private breakpointObserver: BreakpointObserver,
    private userService: UserService,
    private http: HttpClient,
    private configService: ConfigService,
    private router: Router,
    private errorsService: ErrorsService,
    private messageServie: MessageService,
    private analyticsSerivce: AnalyticsService
  ) {

  }

  ngOnInit() {
    var index = this.router.url.indexOf("code");
    // console.log("redeirected from fb", this.router.url);
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
      }
      else {
        console.log("in load configuration");
        this.loadConfigurationData();
      }
    }

    this.subscription = this.configService.windowSizeChanged.pipe(takeUntil(this.onDestroy)).subscribe(
      value => {
        if (value.width <= 600) {
          this.desktop = false;
        }
        else {
          this.desktop = true;
        }
      }),
      error => this.anyErrors = true,
      () => this.finished = true

  }

  loginWithFacebook(code) {
    //this.configService.setUserRegionFromIP();
    this.userService.loginWithFacebook(code).pipe(takeUntil(this.onDestroy)).subscribe(data => {
      this.setUserDetails(data);
      this.analyticsSerivce.reprotFacebook(data);
    })
  }

  redirectToFacebook() {
    window.location.href = this.facebookLogin;
  }

  loadConfigurationData() {
    this.http
      .get<any>(this.autoLogin).pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.setUserDetails(data, this.autologin);
        this.analyticsSerivce.reportSignIn(data, true, false);
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

  ngOnDestroy() {

  }
}
