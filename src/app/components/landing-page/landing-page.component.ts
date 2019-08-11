import { Component, OnInit } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { DialogService } from '../../services/dialog.service';
import { LoginComponent } from '../login/login.component';
import { GlobalVariable } from '../../../global';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  routes: Routes = [{ path: 'register', component: RegisterComponent }];
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  private autoLogin = this.baseApiUrl + '/registration/auto-login';

  constructor(
    private router: Router,
    private dialogService: DialogService,
    private http: HttpClient,
    private userService: UserService,
    private configService: ConfigService
  ) {}
  // 'use strict';

  ngOnInit() {}

  registerPage() {
    this.dialogService.openModalWindow(LoginComponent);
  }

  explorePage() {
    this.router.navigate(['/explore']);
  }

  loadConfigurationData() {
    this.http
      .get<any>(this.autoLogin, { observe: 'response' })
      .pipe(
        map(data => {
          console.log(
            'IM IN DATA CONFIG SERVICE, USER CRED ARE',
            data.body.userId,
            data.body.userName
          );
          this.userService.userId = data.body.userId;
          this.userService.username = data.body.userName;
          this.userService.updateUser(data.body.userId);
          this.router.navigate(['/feed/' + data.body.userId]);
          this.configService.setSessionStorage(data.body.userId.toString());
        })
      )
      .toPromise();
  }
}
