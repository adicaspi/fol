import { Injectable } from '@angular/core';
import mixpanel from 'mixpanel-browser';
import { last } from '../../../node_modules/rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  lastEvent: String;
  currPage: String;
  prevPage: String;

  constructor() { }

  reportSignUp(data, email?, isFacebook?) {
    mixpanel.identify(data.userId);
    mixpanel.people.set_once({ //set these properties for the user if not already set
      '$name': data.userName,
      '$created': new Date(),
      '$email': email
    });
    // mixpanel.track("Sign Up", {
    //   "username": data.userName,
    //   "isFacebook": isFacebook
    // });
    this.trackEvent("Sign Up", {
      "Username": data.userName,
      "Is Facebook": isFacebook
    })
    mixpanel.time_event("User Session");
  }

  trackEvent(eventName, eventJson) {
    //add common properties
    eventJson.addProperty("Last Event", this.lastEvent);
    //etc
    mixpanel.track(eventName, eventJson);
  }

  reportSignIn(data, isAutoLogin?, isFacebook?) {
    mixpanel.identify(data.userId);
    mixpanel.people.set_once({ //set these properties for the user if not already set
      '$name': data.userName,
    });
    mixpanel.track("Sign In", {
      "Username": data.username,
      "Is Auto Login": isAutoLogin,
      "Is Facebook": isFacebook
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

  reportProductPageView(productID, ownerID, ownerUserName, price, description, storeName, storeID, link, viewerID, referrerPage
  ) {
    mixpanel.track("Product Page Visit", {
      "product ID": productID,
      "Owner ID": ownerID,
      "Owner User Name": ownerUserName,
      "Price": price,
      "Description": description,
      "Store Name": storeName,
      "store ID": storeID,
      "Link": link,
      "Viewer ID": viewerID,
      "Referrer Page": referrerPage
    });
  }

  reportTimelinefeedView() {
    mixpanel.track("Feed Page Visit");
  }

  reportGeneralExploreView() {
    mixpanel.track("General Explore Page Visit");
  }

  reportExploreView() {
    mixpanel.track("Explore Page Visit");
  }

  reportUserProfileView(masterId, slaveId, username, fullName, description) {
    mixpanel.track("User Profile Page Visit", {
      "Master Id": masterId,
      "Slave Id": slaveId,
      "Username": username,
      "Full Name": fullName,
      "Description": description
    });
  }

  reportMyProfileView(masterId, slaveId, username, fullName, description) {
    mixpanel.track("My Profile Page Visit", {
      "Master Id": masterId,
      "Slave Id": slaveId,
      "Username": username,
      "Full Name": fullName,
      "Description": description
    });
  }

  reportViewOnWebsite(productID, ownerID, ownerUserName, price, description, storeName, storeID, link, viewerID, referrerPage) {
    mixpanel.track("View on Website", {
      "Product ID": productID,
      "Owner ID": ownerID,
      "Owner User Name": ownerUserName,
      "Price": price,
      "Description": description,
      "Store Name": storeName,
      "store ID": storeID,
      "Link": link,
      "Viewer ID": viewerID,
      "Referrer Page": referrerPage
    });
  }

  reportTimelineFeedSessionStart() {
    mixpanel.time_event("Feed Page Exit");
  }

  reportTimelineFeedSessionEnd() {
    mixpanel.track("Feed Page Exit");
  }

  reportUserProfileSessionStart() {
    mixpanel.time_event("User Profile Page Exit");
  }

  reportUserProfileSessionEnd(masterId, slaveId, username, fullName, description) {
    mixpanel.track("User Profile Page Exit", {
      "Master Id": masterId,
      "Slave Id": slaveId,
      "Username": username,
      "Full Name": fullName,
      "Description": description
    });
  }

  reportMyProfileSessionStart() {
    mixpanel.time_event("My Profile Page Exit");
  }

  reportMyProfileSessionEnd(masterId, SlaveId, username, fullName, description) {
    mixpanel.track("My Profile Page Exit", {
      "Master Id": masterId,
      "Slave Id": SlaveId,
      "Username": username,
      "Full Name": fullName,
      "Description": description
    });
  }

  reportExploreSessionStart() {
    mixpanel.time_event("Explore Page Exit");
  }

  reportExploreSessionEnd() {
    mixpanel.track("Explore Page Exit");
  }

  reportGeneralExploreSessionStart() {
    mixpanel.time_event("General Explore Page Exit");
  }

  reportGeneralExploreSessionEnd() {
    mixpanel.track("General Explore Page Exit");
  }

  reportDiscoverPeopleSessionStart() {
    mixpanel.time_event("Discover Page Exit");
  }

  reportDiscoverPeopleSessionEnd() {
    mixpanel.track("Discover Page Exit");
  }
}
