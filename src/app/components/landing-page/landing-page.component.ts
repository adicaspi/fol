import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Routes, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { RegisterComponent } from '../register/register.component';
import { UserService } from '../../services/user.service';
import { ConfigService } from '../../services/config.service';
import { Subscription, Observable } from 'rxjs';
import { FeedService } from '../../services/feed.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  routes: Routes = [{ path: 'register', component: RegisterComponent }];
  desktop: boolean;
  private baseApiUrl = environment.BASE_API_URL;
  private autoLogin = this.baseApiUrl + '/registration/auto-login';
  private WindowSizeSubscription: Subscription;
  facebookLoginCode: string;

  constructor(
    private userService: UserService,
    private feedService: FeedService,
    private configService: ConfigService,
    private titleService: Title,
    private meta: Meta
  ) {
    this.WindowSizeSubscription = this.configService.windowSizeChanged
      .subscribe(
        value => {
          if (value.width >= 600) {
            this.desktop = true;
          }

          if (value.width <= 600) {
            this.desktop = false;
          }
        });
  }
  // 'use strict';

  ngOnInit() {

    this.titleService.setTitle('Followear: Outsmart Shopping Together');
    this.meta.addTag({ name: 'description', content: 'Create an account or log in to Followear - A simple & easy way to share fashion items from your favorite stores.' });
    this.meta.addTag({ name: 'robots', content: 'index' })

    // if (this.configService.iOS) {
    //   window.location.href = "https://apps.apple.com/app/followear/id1476265803";
    // } else {
    //   this.router.navigate(['landing']);
    // }

  }



  ngOnDestroy(): void {
    this.WindowSizeSubscription.unsubscribe();
  }
}
