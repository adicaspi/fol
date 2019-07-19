import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { ViewProfileComponent } from '../view-profile/view-profile.component';
import { RegisterComponent } from '../register/register.component';
import { SettingsComponent } from '../settings/settings.component';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  enabled: boolean = false;
  loggedin = false;
  feed: boolean = false;
  explore: boolean = false;
  profile: boolean = false;
  mobile: boolean = false;
  routes: Routes = [
    { path: 'profile/:id', component: ViewProfileComponent },
    { path: '', component: RegisterComponent },
    { path: 'settings/:id', component: SettingsComponent }
  ];
  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    if (this.router.url.includes('profile')) {
      this.profile = true;
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

    if (this.deviceService.isMobile() || this.deviceService.isTablet()) {
      this.mobile = true;
    }
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
