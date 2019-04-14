import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Routes, Router } from '@angular/router';
import { ViewProfileComponent } from '../view-profile/view-profile.component';
import { RegisterComponent } from '../register/register.component';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-mutual-nav',
  templateUrl: './mutual-nav.component.html',
  styleUrls: ['./mutual-nav.component.css']
})
export class MutualNavComponent implements OnInit {
  loggedin = false;
  margin = '0%';

  @Input('enabled') enabled: boolean = true;
  routes: Routes = [
    { path: 'profile/:id', component: ViewProfileComponent },
    { path: 'regsiter', component: RegisterComponent },
    { path: 'settings/:id', component: SettingsComponent }
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

  settingsPage() {
    if (this.loggedin) {
      this.router.navigate(['settings', this.userService.userId]);
    } else {
      this.router.navigate(['register']);
    }
  }
}
