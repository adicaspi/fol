import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { ViewProfileComponent } from '../view-profile/view-profile.component';
import { RegisterComponent } from '../register/register.component';
import { SettingsComponent } from '../settings/settings.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatMenuTrigger } from '../../../../node_modules/@angular/material';
import { MutualNavComponent } from '../mutual-nav/mutual-nav.component';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  //  @ViewChild(MatMenuTrigger, { static: false }) menu: MatMenuTrigger;

  enabled: boolean = false;
  menuIsClosed: boolean = true;
  loggedin = false;
  feed: boolean = false;
  masterId: number;
  userId: number;
  explore: boolean = false;
  profile: boolean = false;
  mobile: boolean = false;
  routes: Routes = [
    { path: 'profile/:id', component: ViewProfileComponent },
    { path: '', component: RegisterComponent },
    { path: 'settings/:id', component: SettingsComponent }
  ];
  private subscription;
  private anyErrors: boolean;
  private finished: boolean;
  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private deviceService: DeviceDetectorService,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    const routeParams = this.activatedRoute.snapshot.params;
    this.masterId = parseInt(routeParams.id);
    this.userId = this.userService.userId;
    if (this.router.url.includes('profile')) {
      if (this.userId == this.masterId) {
        this.profile = true;
      }
    }
    if (this.router.url.includes('feed')) {
      this.feed = true;
    }
    if (this.router.url.includes('explore')) {
      this.explore = true;
    }
    if (this.userService.userId) {
      this.loggedin = true;
    }
    this.subscription = this.configService.windowSizeChanged.subscribe(
      value => {
        if (value.width <= 600) {
          this.mobile = true;
        }
      }),
      error => this.anyErrors = true,
      () => this.finished = true


    // if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
    //   this.mobile = true;
    // }
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


  openCloseMenu() {
    console.log("im in func", this.menuIsClosed);
    if (this.menuIsClosed) {
      console.log("im in func openig");
      //this.menu.openMenu();
      this.menuIsClosed = false;
    }
    else {
      console.log("im in func closeing");

      //this.menu.closeMenu();
      this.menuIsClosed = true;
    }

  }
}
