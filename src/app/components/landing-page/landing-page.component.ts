import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Routes, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { RegisterComponent } from '../register/register.component';
import { DialogService } from '../../services/dialog.service';
import { LoginComponent } from '../login/login.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { ConfigService } from '../../services/config.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '../../../../node_modules/@angular/material';

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
  facebookLoginEndpoint: string = "https://localauth.followear.com/oauth2/authorize?identity_provider=Facebook&redirect_uri=https://www.followear.com&response_type=CODE&client_id=k60gq4qju60fgadkps8obq59h&scope=email%20openid";
  facebookLoginEndpointTemp = "https://www.followear.com/?code=f2280771-f736-4856-9011-236522ee6b7e#_=_"
  facebookLoginCode: string;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private dialogService: DialogService,
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
    console.log(this.router.url);
    var index = this.facebookLoginEndpointTemp.indexOf("code");
    if (index != -1) {
      this.facebookLoginCode = this.facebookLoginEndpointTemp.substring(index + 5);
      console.log(this.facebookLoginCode);
    }
  }
  // 'use strict';

  ngOnInit() {
    this.titleService.setTitle('Followear: Outsmart Shopping Together');
    this.meta.addTag({ name: 'description', content: 'Create an account or log in to Followear - A simple & easy way to share fashion items from your favorite stores.' });
    this.meta.addTag({ name: 'robots', content: 'index' })
  }

  registerPage(): void {
    if (this.desktop) {
      const dialogRef = this.dialog.open(LoginComponent, {
        width: '400px',
        height: '580px',
        data: { close: true }
      });
    }
    else {
      this.router.navigate(['/login']);
    }
  }

  explorePage() {
    this.router.navigate(['/explore']);
  }

  loadConfigurationData() {
    this.http
      .get<any>(this.autoLogin, { observe: 'response' })
      .pipe(
        map(data => {

          this.userService.userId = data.body.userId;
          this.userService.username = data.body.userName;
          this.userService.updateUser(data.body.userId);
          this.router.navigate(['/feed/' + data.body.userId]);
          this.configService.setSessionStorage(data.body.userId.toString());
        })
      )
      .toPromise();
  }

  ngOnDestroy(): void {
    this.WindowSizeSubscription.unsubscribe();
  }
}
