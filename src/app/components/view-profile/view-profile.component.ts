import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeviceDetectorService } from '../../../../node_modules/ngx-device-detector';
import { ConfigService } from '../../services/config.service';
import { ErrorsService } from '../../services/errors.service';
import { UserService } from '../../services/user.service';
import { FeedService } from '../../services/feed.service';
import { Router, NavigationEnd, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { User } from '../../models/User';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css'],
  host: {
    '(document:click)': 'onClick($event)'
  }
})
export class ViewProfileComponent implements OnInit {
  desktop: boolean = true;
  classToApply: string = 'center';
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  searchedTouched: Observable<boolean>;
  mobileSearchedTouched: Observable<boolean>;
  userId: number;
  masterId: number;
  userProfile: boolean = false;
  masterUser: User;
  private subscription;
  private anyErrors: boolean;
  private finished: boolean;
  public previousUrl: string = "";
  public currentUrl: string = "";
  // isHandset$: Observable<boolean> = this.breakpointObserver
  //   .observe(Breakpoints.Handset)
  //   .pipe(map(result => result.matches));

  constructor(
    private breakpointObserver: BreakpointObserver,
    private deviceService: DeviceDetectorService,
    private configService: ConfigService,
    private feedService: FeedService,
    public router: Router,
    public userService: UserService,
    public activatedRoute: ActivatedRoute,
  ) {
    this.userId = this.userService.userId;
    const routeParams = this.activatedRoute.snapshot.params;
    this.masterId = parseInt(routeParams.id);
    if (this.userId == this.masterId) {
      this.userProfile = true;
    } else {
      this.userService.getUserDetails(this.masterId).subscribe(res => {
        this.masterUser = res
      });
    }
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      };
    });
  }

  ngOnInit() {
    this.feedService.currentLoadedFeedComponent = "profile";
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

  goBack() {
    console.log("in go back", this.previousUrl);
    this.router.navigate([this.previousUrl]);
  }
}
