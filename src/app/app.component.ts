import { Component, OnInit, HostListener } from '@angular/core';
import mixpanel from 'mixpanel-browser';
import { UserService } from './services/user.service';
import { AnalyticsService } from './services/analytics.service';
import { ActivatedRoute } from '../../node_modules/@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from '../../node_modules/rxjs';
import { User } from './models/User';


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
  user: User;
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
        this.lastPageVisit = this.analyticsService.getCurrPage(); // Get the last page visit before enterting in active state 
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
      //localStorage.removeItem("user_id");
      this.endSessionInLastVisitedComponent();
      mixpanel.track("User Session");
    }


  }

  endSessionInLastVisitedComponent() {
    this.lastPageVisit = this.analyticsService.getCurrPage();
    switch (this.lastPageVisit) {
      case "Feed Page":
        this.analyticsService.reportTimelineFeedSessionEnd();
        break;
      case "User Profile Page":
        this.user = Object.assign({}, this.userService.userObject);
        this.analyticsService.reportUserProfileSessionEnd(this.user.id, this.userService.getCurrentUser(), this.user.username, this.user.fullName, this.user.description)
        break;
      case "My Profile Page":
        this.user = Object.assign({}, this.userService.userObject);
        this.analyticsService.reportMyProfileSessionEnd(this.userService.userObject.id, this.userService.userObject.username, this.userService.userObject.fullName, this.userService.userObject.description)

        break;
      case "Explore Page":
        this.analyticsService.reportExploreSessionEnd();
        break;
      case "General Explore Page":
        this.analyticsService.reportGeneralExploreSessionEnd();
        break;
      case "Discover Page":
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
