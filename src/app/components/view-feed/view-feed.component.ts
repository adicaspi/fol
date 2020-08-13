import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfigService } from '../../services/config.service';
import { ErrorsService } from '../../services/errors.service';
import { FeedService } from '../../services/feed.service';
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
  facebookLoginCode: string;
  filteredOptions: Observable<string[]>;
  searchedTouched: Observable<boolean>;
  error: any = {};
  private subscription;
  private autoLoginSubscription: Subscription;
  private anyErrors: boolean;
  private finished: boolean;
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
        // this.facebookLoginCode = this.facebookLoginEndpointTemp.substring(index + 5);
        this.facebookLoginCode = this.router.url.substring(index + 5);
        console.log(this.facebookLoginCode);
      } else {
        this.loadConfigurationData();
      }
    }
    this.feedService.currentLoadedFeedComponent = "feed";
    this.subscription = this.configService.windowSizeChanged.subscribe(
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

  loadConfigurationData() {
    this.http
      .get<any>(this.autoLogin, { observe: 'response' })
      .pipe(
        map(data => {
          this.userId = true;

          this.userService.userId = data.body.userId;
          this.userService.username = data.body.userName;
          this.userService.updateUser(data.body.userId);
          this.configService.setSessionStorage(data.body.userId.toString());
        })
      ).toPromise();

  }
}
