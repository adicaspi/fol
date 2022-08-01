import { Component, OnInit, HostListener } from '@angular/core';
import mixpanel from 'mixpanel-browser';
import { UserService } from './services/user.service';
import { AnalyticsService } from './services/analytics.service';
import { ActivatedRoute } from '../../node_modules/@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from '../../node_modules/rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'followear-app';
  lastPageVisit: string;
  startTime = 0;
  endTime = 0;
  inActiveTime: any;
  onDestroy: Subject<void> = new Subject<void>();
  constructor(private userService: UserService,
    private analyticsService: AnalyticsService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.startTime = performance.now();
    console.log("session is active");
    mixpanel.time_event("User Session"); //Start measuring session time on the app  


    document.addEventListener("visibilitychange", event => {
      if (document.visibilityState === "visible") {
        this.inActiveTime = (this.endTime - this.startTime) / 1000; //seconds
        if ((this.inActiveTime) / 60 >= 10) { //Tab was inactive for 10 mins, start measuring session time
          this.startTime = performance.now();
          console.log("user session started");
          mixpanel.time_event("User Session"); //Start measuring session time on the app since last active 
        }
      }
      else { // Web tab is not active
        this.endTime = performance.now();
        this.lastPageVisit = this.userService.getCurrPage(); // Get the last page visit before enterting in active state 
        console.log("tab switched, session still active");
        this.inActiveTime = (this.endTime - this.startTime) / 1000; //inactive time in seconds
        if ((this.inActiveTime) / 60 >= 10) { //Tab was inactive for 10 mins
          console.log("session ended");
          //this.endSessionInLastVisitedComponent();
          mixpanel.track("User Session"); //Session ended on the web
        }
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event) {
    console.log("refresh", event);

    console.log(performance.navigation.type);
    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
      console.log("This page is reloaded");

    } else {
      console.info("This page is not reloaded");
      localStorage.removeItem("user_id");
      //this.endSessionInLastVisitedComponent();
      mixpanel.track("User Session");
    }


  }

  endSessionInLastVisitedComponent() {
    this.lastPageVisit = this.userService.getCurrPage();
    switch (this.lastPageVisit) {
      case "feed":
        this.analyticsService.reportTimelineFeedSessionEnd();
        break;
      case "user profile":
        this.activatedRoute.params
          .pipe(takeUntil(this.onDestroy))
          .subscribe(params => {
            let id = +params['id'];
            this.userService.getUserProfileInfo(id).subscribe(user => {
              this.analyticsService.reportUserProfileSessionEnd(user.id, this.userService.getCurrentUser(), user.username, user.fullName, user.description);
            });
          })
        break;
      case "my profile":
        this.activatedRoute.params
          .pipe(takeUntil(this.onDestroy))
          .subscribe(params => {
            let id = +params['id'];
            this.userService.getUserProfileInfo(id).subscribe(user => {
              this.analyticsService.reportMyProfileSessionEnd(user.id, user.id, user.username, user.fullName, user.description)
            });
          })

        break;
      case "explore":
        this.analyticsService.reportExploreSessionEnd();
        break;
      case "general explore":
        this.analyticsService.reportGeneralExploreSessionEnd();
        break;
      case "discover":
        this.analyticsService.reportDiscoverPeopleSessionEnd();
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    //this.endSessionInLastVisitedComponent();
    mixpanel.track("User Session");
    this.onDestroy.next();
    this.onDestroy.complete();

  }
}
