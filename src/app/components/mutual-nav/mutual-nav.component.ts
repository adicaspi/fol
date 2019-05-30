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
  feed: boolean = false;
  profile: boolean = false;

  @Input('enabled') enabled: boolean = true;
  routes: Routes = [
    { path: 'profile/:id', component: ViewProfileComponent },
    { path: 'feed/:id', component: RegisterComponent },
    { path: 'settings/:id', component: SettingsComponent }
  ];
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    if (this.router.url.match('/profile')) {
      this.profile = true;
    }
    if (this.router.url.match('/feed')) {
      this.feed = true;
    }
  }

  profilePage() {
    this.router.navigate(['profile', this.userService.userId]);
    this.profile = true;
    this.feed = false;
  }

  feedPage() {
    this.router.navigate(['feed', this.userService.userId]);
    this.feed = true;
    this.profile = false;
  }
}
