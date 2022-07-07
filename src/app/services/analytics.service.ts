import { Injectable } from '@angular/core';
import mixpanel from 'mixpanel-browser';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  reportSignUp(data, email?, isFacebook?) {
    mixpanel.identify(data.userId);
    mixpanel.people.set_once({ //set these properties for the user if not already set
      '$name': data.userName,
      '$created': new Date(),
      '$email': email
    });
    mixpanel.track("Sign Up", {
      "username": data.userName,
      "isFacebook": isFacebook
    });
    mixpanel.time_event("User Session");
  }

  reportSignIn(data, isAutoLogin?, isFacebook?) {
    mixpanel.identify(data.userId);
    mixpanel.people.set_once({ //set these properties for the user if not already set
      '$name': data.userName,
    });
    mixpanel.track("Sign In", {
      "username": data.username,
      "isAutoLogin": isAutoLogin,
      "isFacebook": isFacebook
    });

    mixpanel.time_event("User Session"); //Start measuring time until log out
  }

  reprotFacebook(data) {
    if (data.new) {
      this.reportSignUp(data, null, true);
    } else {
      this.reportSignIn(data, null, true);
    }
  }

  reportLogout(param?) {
    if (param) {
      mixpanel.track("Log Out", {
        reason: param
      });
    } else {
      mixpanel.track("Log Out");
    }
  }

  reportProductPageView(refferingPage) {
    mixpanel.track("Product page visit", {
      "reffering": refferingPage
    });
  }

  reportTimelinefeedView() {
    mixpanel.track("Feed page visit");
  }

  reportGeneralExploreView() {
    mixpanel.track("General Explore page visit");
  }

  reportExploreView() {
    mixpanel.track("Explore page visit");
  }

  reportUserProfileView() {
    mixpanel.track("User Profile page visit");
  }

  reportMyProfileView() {
    mixpanel.track("My Profile page visit");
  }

  reportViewOnWebsite() {
    mixpanel.track("View on Website");
  }

  reportTimelineFeedSessionStart() {
    mixpanel.time_event("Viewing Feed Exit");
  }

  reportTimelineFeedSessionEnd() {
    mixpanel.track("Viewing Feed Exit");
  }

  reportUserProfileSessionStart(masterId?) {
    mixpanel.time_event("Viewing User Profile Exit", {
      "masterId": masterId
    });
  }

  reportUserProfileSessionEnd(masterId?) {
    mixpanel.track("Viewing User Profile Exit", {
      "masterId": masterId
    });
  }

  reportMyProfileSessionStart() {
    mixpanel.time_event("Viewing My Profile Exit");
  }

  reportMyProfileSessionEnd() {
    mixpanel.track("Viewing My Profile Exit");
  }

  reportExploreSessionStart() {
    mixpanel.time_event("Viewing Explore Exit");
  }

  reportExploreSessionEnd() {
    mixpanel.track("Viewing Explore Exit");
  }

  reportGeneralExploreSessionStart() {
    mixpanel.time_event("Viewing General Explore Exit");
  }

  reportGeneralExploreSessionEnd() {
    mixpanel.track("Viewing General Explore Exit");
  }

  reportDiscoverPeopleSessionStart() {
    mixpanel.time_event("Viewing Discover People Exit");
  }

  reportDiscoverPeopleSessionEnd() {
    mixpanel.track("Viewing Discover People Exit");
  }
}
