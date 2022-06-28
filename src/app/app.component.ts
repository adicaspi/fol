import { Component, OnInit } from '@angular/core';
import mixpanel from 'mixpanel-browser';
import { UserService } from './services/user.service';

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
  constructor(private userService: UserService) {

  }

  ngOnInit() {
    this.startTime = performance.now();
    console.log("session is active");
    mixpanel.time_event("Session Start"); //Start measuring session time on the app

    document.addEventListener("visibilitychange", event => {
      if (document.visibilityState === "visible") {
        this.inActiveTime = (this.endTime - this.startTime) / 1000;
        console.log(this.inActiveTime / 60);
        if ((this.inActiveTime / 60) >= 10) { //Tab was inactive for 10 mins, start measuring session time
          this.startTime = performance.now();
          console.log("new session started");
          mixpanel.time_event("Session Start"); //Start measuring session time on the app since last active 
        }
      }
      else { // Web tab is not active
        this.endTime = performance.now();
        this.lastPageVisit = this.userService.getCurrPage(); // Get the last page visit before enterting in active state 
        console.log("tab switched, session still active");
        this.inActiveTime = (this.endTime - this.startTime) / 1000; //inactive time in seconds
        if ((this.inActiveTime / 60) >= 10) { //Tab was inactive for 10 mins
          console.log("session ended");
          mixpanel.track("Session Start"); //Session ended on the web
          switch (this.lastPageVisit) {
            case "feed":
              mixpanel.track("Viewing Feed");
              break;
            case "user profile":
              mixpanel.track("Viewing User Profile");
              break;
            case "my profile":
              mixpanel.track("Viewing My Profile");
              break;
            case "explore":
              mixpanel.track("Viewing Explore");
              break;
            case "general explore":
              mixpanel.track("Viewing General Explore");
              break;
            case "discover":
              mixpanel.track("Viewing Discover People");
              break;
            case "product":
              mixpanel.track("Viewing Product");
              break;
            default:
              //mixpanel.track("Session Start");
              break;
          }
        }
      }
    });
  }

  ngOnDestroy() {
    console.log("app was destroyed");
    mixpanel.track("Session Start"); //User moved from Feed
  }
}
