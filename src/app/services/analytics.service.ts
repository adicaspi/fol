import { Injectable } from '@angular/core';
import mixpanel from 'mixpanel-browser';
import { last } from '../../../node_modules/rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  currEvent: string;
  lastEvent: string;
  currPage: string;
  prevPage: string;

  constructor() { }

  updatePage(page: string) {
    if (this.currPage == null) {
      this.currPage = page;
      this.prevPage = page;
    } else {
      this.prevPage = this.currPage;
      this.currPage = page;
    }
  }

  updateEvent(event) {
    if (this.lastEvent == null) {
      this.currEvent = event;
      this.lastEvent = event;
    } else {
      this.lastEvent = this.currEvent;
      this.currEvent = event;
    }
  }

  getCurrPage() {
    return this.currPage;
  }

  getPrevPage() {
    return this.prevPage;
  }

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
    this.updateEvent("Sign Up");
  }

  trackEvent(eventName, eventJson) {
    //add common properties
    eventJson["Last Event"] = this.lastEvent;
    eventJson["Current Page"] = this.currPage;
    eventJson["Previous Page"] = this.prevPage;
    //etc
    mixpanel.track(eventName, eventJson);
  }

  reportSignIn(data, isAutoLogin?, isFacebook?) {
    mixpanel.identify(data.userId);
    mixpanel.people.set_once({ //set these properties for the user if not already set
      '$name': data.userName,
    });
    this.updateEvent("Sign In");
    this.trackEvent("Sign In", {
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
    this.updateEvent("Log Out");
    if (param) {
      this.trackEvent("Log Out", {
        reason: param
      });
    } else {
      this.trackEvent("Log Out", {});
    }
  }

  reportProductPageView(productID, ownerID, ownerUserName, price, description, storeName, storeID, link, viewerID, referrerPage, salePrice, website, numViews, numLikes, uploadDate) {
    this.updateEvent("Product Page Visit");
    this.trackEvent("Product Page Visit", {
      "Description": description,
      "Link": link,
      "Price": price,
      "Salerice": salePrice,
      "product ID": productID,
      "Owner ID": ownerID,
      "Owner Username": ownerUserName,
      "Store ID": storeID,
      "Store Name": storeName,
      "Website": website,
      "Num Views": numViews,
      "Num Likes": numLikes,
      "Post Upload Date": uploadDate,
      "Referrer Page": referrerPage
    });
  }

  reportTimelinefeedView() {
    this.updateEvent("Feed Page Visit");
    this.trackEvent("Feed Page Visit", {});
  }

  reportGeneralExploreView() {
    this.updateEvent("General Explore Visit");
    this.trackEvent("General Explore Page Visit", {});
  }

  reportExploreView() {
    this.updateEvent("Explore Page Visit");
    this.trackEvent("Explore Page Visit", {});
  }

  reportUserProfileView(masterId, slaveId, username, fullName, description) {
    this.updateEvent("User Profile Page Visit");
    this.trackEvent("User Profile Page Visit", {
      "User ID": masterId,
      "Username": username
    });
  }

  reportMyProfileView(masterId, username, fullName, description) {
    this.updateEvent("My Profile Page Visit");
    this.trackEvent("My Profile Page Visit", {
      "User ID": masterId,
      "Username": username
    });
  }

  reportViewOnWebsite(productID, ownerID, ownerUserName, price, description, storeName, storeID, link, viewerID, referrerPage) {
    this.updateEvent("View On Website");
    this.trackEvent("View on Website", {
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
    this.updateEvent("Feed Page Exit");
    this.trackEvent("Feed Page Exit", {});
  }

  reportUserProfileSessionStart() {
    mixpanel.time_event("User Profile Page Exit");

  }

  reportUserProfileSessionEnd(masterId, slaveId, username, fullName, description) {
    this.updateEvent("User Profile Page Exit");
    mixpanel.track("User Profile Page Exit", {
      "User ID": masterId,
      "Username": username
    });
  }

  reportMyProfileSessionStart() {
    mixpanel.time_event("My Profile Page Exit");
  }

  // reportMyProfileSessionEnd(masterId, SlaveId, username, fullName, description) {
  //   mixpanel.track("My Profile Page Exit", {
  //     "Master Id": masterId,
  //     "Slave Id": SlaveId,
  //     "Username": username,
  //     "Full Name": fullName,
  //     "Description": description
  //   });
  // }

  reportMyProfileSessionEnd(masterId, username, fullName?, description?) {
    this.updateEvent("My Profile Page Exit");
    mixpanel.track("My Profile Page Exit", {
      "User ID": masterId,
      "Username": username
    });
  }


  reportExploreSessionStart() {
    mixpanel.time_event("Explore Page Exit");
  }

  reportExploreSessionEnd() {
    this.updateEvent("Explore Page Exit");
    mixpanel.track("Explore Page Exit");
  }

  reportGeneralExploreSessionStart() {
    mixpanel.time_event("General Explore Page Exit");
  }

  reportGeneralExploreSessionEnd() {
    this.updateEvent("General Explore Page Exit");
    this.trackEvent("General Explore Page Exit", {});
  }

  reportDiscoverPeopleSessionStart() {
    mixpanel.time_event("Discover Page Exit");
  }

  reportDiscoverPeopleSessionEnd() {
    this.updateEvent("Discover Page Exit");
    this.trackEvent("Discover Page Exit", {});

  }
}
