import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

import { Routes, Router } from '@angular/router';
import { ViewProfileComponent } from '../view-profile/view-profile.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-landing-nav',
  templateUrl: './landing-nav.component.html',
  styleUrls: ['./landing-nav.component.css']
})
export class LandingNavComponent implements OnInit {
  loggedin = false;
  routes: Routes = [
    { path: 'profile/:id', component: ViewProfileComponent },
    { path: 'regsiter', component: RegisterComponent }
  ];
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    if (this.userService.userId) {
      this.loggedin = true;
    }
    console.log('im log in status', this.loggedin);
  }

  profilePage() {
    if (this.loggedin) {
      this.router.navigate(['profile', this.userService.userId]);
    } else {
      this.router.navigate(['register']);
    }
  }

  clicked() {
    console.log('i was clicked');
  }
}
