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
  title = 'Welcome to Followear';
  private baseApiUrl = environment.BASE_API_URL;
  private autoLogin = this.baseApiUrl + '/registration/auto-login';
  private WindowSizeSubscription: Subscription;

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
  }
  // 'use strict';

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.meta.addTag({ name: 'description', content: 'Create an account or log in to Followear - A simple & easy way to share fashion items from your favorite stores.' });
    this.meta.addTag({ name: 'robots', content: 'index' })
  }

  registerPage(): void {
    if (this.desktop) {
      const dialogRef = this.dialog.open(LoginComponent, {
        width: '400px',
        height: '580px',
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
