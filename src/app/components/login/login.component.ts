import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../services/user.service';
import { ErrorsService } from '../../services/errors.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalVariable } from '../../../global';
import { ConfigService } from '../../services/config.service';
import { DialogService } from '../../services/dialog.service';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  subscription: Subscription;
  error: any;
  loginForm: FormGroup;
  submitted = false;
  userId: number;
  wrongPassUser: boolean = false;
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  private autoLogin = this.baseApiUrl + '/registration/auto-login';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private errorsService: ErrorsService,
    private http: HttpClient,
    private configSerivce: ConfigService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private dialogService: DialogService
  ) {
    this.subscription = this.errorsService.getMessage().subscribe(msg => {
      this.error = msg;
    });
  }

  ngOnInit() {
    this.dialogRef.updateSize('400px', '580px');
    this.loginForm = this.formBuilder.group({
      emailLogin: [''], //[Validators.required, Validators.email]],
      passwordLogin: [''] //[Validators.required]]
    });

    //Check if user can auto-login
    //this.loadConfigurationData();
  }

  // convenience getter for easy access to form fields

  get l() {
    return this.loginForm.controls;
  }

  onSubmitLogin() {
    let email = this.loginForm.value.emailLogin;
    let password = this.loginForm.value.passwordLogin;
    let res = {
      email: email,
      password: password
    };

    this.userService
      .login(res)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data, 'im data login form');
          this.userService.userId = data.userId;
          this.userService.username = data.username;
          this.userService.updateUser(data.userId);

          this.configSerivce.setSessionStorage(data.userId.toString());
          this.router.navigate(['/feed/' + data.userId]);
          this.ngOnDestroy();
        },
        error => {
          if (this.error.error == 'Invalid Authentication Data') {
            this.wrongPassUser = true;
          }
        }
      );
  }

  regsiterPage() {
    this.dialogService.openDialog(RegisterComponent);
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
          this.configSerivce.setSessionStorage(data.body.userId.toString());
        })
      )
      .toPromise();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
