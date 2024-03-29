import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { Routes, Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ViewProfileComponent } from '../view-profile/view-profile.component';
import { RegisterComponent } from '../register/register.component';
import { SettingsComponent } from '../settings/settings.component';
import { UserService } from '../../services/user.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import * as jquery from 'jquery';
import { User } from '../../models/User';
import { MessageService } from '../../services/message.service';



@Component({
  selector: 'app-bottom-navbar',
  templateUrl: './bottom-navbar.component.html',
  styleUrls: ['./bottom-navbar.component.scss']
})
export class BottomNavbarComponent implements OnInit {
  @ViewChild('bottomnavbar', { static: false }) bottomNavBar: ElementRef;
  feed: boolean = true;
  explore: boolean = false;
  profile: boolean = false;
  bottomNavBarClass = "bottom-navbar";
  masterId: number;
  userId: number;
  prevScrollpos: number;
  currentScrollPos: number;
  show: boolean = true;
  init: boolean = false;
  scroll: boolean = false;
  timeout: any;
  user: Observable<User>;
  onDestroy: Subject<void> = new Subject<void>();

  routes: Routes = [
    { path: 'profile/:id', component: ViewProfileComponent },
    { path: '', component: RegisterComponent },
    { path: 'settings/:id', component: SettingsComponent }
  ];

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    this.userId = this.userService.userId;
    if (this.userId) {
      this.user = this.userService.getUserProfileInfo(this.userId);
    }

    this.activatedRoute.url
      .pipe(takeUntil(this.onDestroy))
      .subscribe(params => {

        if (params.length > 0) {
          switch (params[0].path) {
            case "feed":
              this.feed = true;
              this.explore = false;
              this.profile = false;
              break;
            case "profile":
              if (params.length > 1) {
                if ((params[1].path) == this.userId.toString()) {
                  this.profile = true;
                } else {
                  this.profile = false;
                }
              }
              this.feed = false;
              this.explore = false;
              break;
            case "explore":
              this.feed = false;
              this.explore = true;
              this.profile = false;
              break;
            default:
              this.feed = false;
              this.explore = false;
              this.profile = false;
          }
        }

      });
    this.prevScrollpos = window.pageYOffset;
  }



  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {

    this.scroll = true;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.scroll = false;
      jquery(".bottom-navbar-container").css("bottom", "0px");
    }, 900);
    if (this.scroll) {

      if (window.pageYOffset == 0) {
        jquery(".bottom-navbar-container").css("bottom", "0px");
      }
      else {
        let currentScrollPos = window.pageYOffset;
        if (this.prevScrollpos >= currentScrollPos) {
          // scrolling up
          jquery(".bottom-navbar-container").css("bottom", "0px");
        } else {
          // scrolling down
          jquery(".bottom-navbar-container").css("bottom", "-70px");
        }
        this.prevScrollpos = currentScrollPos;
      }
    }

  }


  get stateName() {
    return this.show ? 'show' : 'hide'
  }

  profilePage() {
    this.profile = true;
    this.feed = false;
    this.explore = false;
    this.messageService.sendMessage("profile clicked");
    this.messageService.clearMessage();
    if (this.router.url.includes("profile")) { //don't navigate to feed, user is already on feed
      this.messageService.sendMessage("scroll up user page");
      this.messageService.clearMessage();
    } else {
      this.router.navigate(['profile', this.userService.userId]);
    }
  }

  feedPage() {
    this.feed = true;
    this.profile = false;
    this.explore = false;
    if (this.router.url == "feed") { //don't navigate to feed, user is already on feed
      this.messageService.sendMessage("scroll up feed page");
      this.messageService.clearMessage();
    } else {
      this.router.navigate(['feed', this.userService.userId]);
    }
  }

  explorePage() {
    this.explore = true;
    this.profile = false;
    this.feed = false;
    if (this.router.url.includes("explore")) { //don't navigate to feed, user is already on feed
      this.messageService.sendMessage("scroll up explore page");
      this.messageService.clearMessage();
    } else {
      this.router.navigate(['/explore', this.userService.userId]);
    }
  }



}
