import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { Routes, Router, ActivatedRoute } from '@angular/router';
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
import * as jquery from 'jquery';


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

  routes: Routes = [
    { path: 'profile/:id', component: ViewProfileComponent },
    { path: '', component: RegisterComponent },
    { path: 'settings/:id', component: SettingsComponent }
  ];

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService) { }

  ngOnInit() {
    const routeParams = this.activatedRoute.snapshot.params;
    this.masterId = parseInt(routeParams.id);
    this.userId = this.userService.userId;
    if (this.router.url.includes('profile')) {
      if (this.userId == this.masterId) {
        this.profile = true;
      }
      this.feed = false;
      this.explore = false;

    }
    if (this.router.url.includes('feed')) {
      this.feed = true;
      this.explore = false;
      this.profile = false;
    }
    if (this.router.url.includes('explore')) {
      this.explore = true;
      this.feed = false;
      this.profile = false;
    }
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
    this.router.navigate(['profile', this.userService.userId]);
  }

  settingsPage() {
    this.router.navigate(['settings', this.userService.userId]);
  }

  feedPage() {
    this.profile = false;
    this.feed = true;
    this.explore = false;
    this.router.navigate(['feed', this.userService.userId]);
  }

  explorePage() {
    this.profile = false;
    this.feed = false;
    this.explore = true;
    this.router.navigate(['/explore', this.userService.userId]);
  }



}
