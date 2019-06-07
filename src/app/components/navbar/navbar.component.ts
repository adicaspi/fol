import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';

import { Routes, Router } from '@angular/router';
import { ViewProfileComponent } from '../view-profile/view-profile.component';
import { RegisterComponent } from '../register/register.component';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  enabled: boolean = false;
  loggedin = false;
  routes: Routes = [
    { path: 'profile/:id', component: ViewProfileComponent },
    { path: '', component: RegisterComponent },
    { path: 'settings/:id', component: SettingsComponent }
  ];
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    if (this.userService.userId) {
      this.loggedin = true;
    }
  }

  profilePage() {
    console.log('in prof');
    this.router.navigate(['profile', this.userService.userId]);
  }

  settingsPage() {
    if (this.loggedin) {
      this.router.navigate(['settings', this.userService.userId]);
    } else {
      this.router.navigate(['']);
    }
  }

  feedPage() {
    if (this.loggedin) {
      this.router.navigate(['feed', this.userService.userId]);
    } else {
      this.router.navigate(['']);
    }
  }

  explorePage() {
    this.router.navigate(['/explore']);
  }
}
