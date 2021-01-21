import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from '../../services/config.service';
import { ErrorsService } from '../../services/errors.service';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-view-feed',
  templateUrl: './view-feed.component.html',
  styleUrls: ['./view-feed.component.css']
})
export class ViewFeedComponent implements OnInit {
  private baseApiUrl = environment.BASE_API_URL;
  private autoLogin = this.baseApiUrl + '/registration/auto-login';
  userId: boolean = false;
  desktop: Boolean = true;
  filteredOptions: Observable<string[]>;
  searchedTouched: Observable<boolean>;
  error: any = {};
  private subscription;
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
    private feedService: FeedService,
    private router: Router,
    private errorsService: ErrorsService
  ) {

  }

  ngOnInit() {
    if (this.userService.userId) {
      this.userId = true;
    } else {
      var index = this.router.url.indexOf("code");
      if (index != -1) {
        var facebookLoginCode = this.router.url.substring(index + 5);
        var hashTagIndex = this.router.url.indexOf("#");
        if (hashTagIndex != -1) {
          facebookLoginCode = this.router.url.substring(index + 5, hashTagIndex);
        }
        this.loginWithFacebook(facebookLoginCode);
      } else {
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
    this.userService.loginWithFacebook(code).pipe(takeUntil(this.onDestroy)).subscribe(data => {
      this.setUserDetails(data);
    })
  }

  loadConfigurationData() {
    this.http
      .get<any>(this.autoLogin).pipe(takeUntil(this.onDestroy))
      .subscribe(data => {
        this.setUserDetails(data);
      })
  }

  setUserDetails(data) {
    this.userId = true;
    this.userService.userId = data.userId;
    this.userService.username = data.userName;
    this.userService.updateUser(data.userId);
    this.configService.setSessionStorage(data.userId.toString());
  }
}
