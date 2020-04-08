import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user.service';
import { ErrorsService } from '../../services/errors.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ConfigService } from '../../services/config.service';
import { DialogService } from '../../services/dialog.service';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorSubscription: Subscription;
  error: any = {};
  loginForm: FormGroup;
  submitted: boolean = false;
  userId: number;
  wrongPass: boolean = false;
  wrongUser: boolean = false;
  modal: boolean = false;
  msgToShow: string;
  onDestroy: Subject<void> = new Subject<void>();
  private baseApiUrl = environment.BASE_API_URL;
  private autoLogin = this.baseApiUrl + '/registration/auto-login';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private errorsService: ErrorsService,
    private http: HttpClient,
    private configSerivce: ConfigService,
    private dialogService: DialogService,
    @Optional() private dialogRef: MatDialogRef<LoginComponent>
  ) {
    if (dialogRef) {
      this.modal = true;
    }
    this.errorSubscription = this.errorsService.getMessage().pipe(takeUntil(this.onDestroy)).subscribe(msg => {
      this.error = msg;
    });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      emailLogin: ['', Validators.required],
      passwordLogin: ['', Validators.required]
    });

    //Check if user can auto-login
    //this.loadConfigurationData();
  }

  // convenience getter for easy access to form fields

  get l() {
    return this.loginForm.controls;
  }

  get loginFormValid() {
    return this.loginForm.valid;
  }

  onSubmitLogin() {
    this.submitted = true;
    this.wrongPass = false;
    this.wrongUser = false;
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
          this.userService.userId = data.userId;
          this.userService.username = data.username;
          this.userService.updateUser(data.userId);

          this.configSerivce.setSessionStorage(data.userId.toString());
          if (this.dialogRef) {
            this.dialogRef.close();
          }
          this.router.navigate(['/feed/' + data.userId]);

        },
        error => {
          this.submitted = false;

          if (this.error.error == 'Invalid Authentication Data') {
            console.log("in login comp msg recived");
            this.wrongPass = true;
            this.msgToShow = 'The password you entered is incorrect.'
          }
          if (this.error.error == 'Invalid User') {
            this.wrongUser = true;
            this.msgToShow = "Username doesn't exist."

          }
        }
      );
  }

  regsiterPage() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogService.openModalWindow(RegisterComponent);
    }
    else {
      this.router.navigate(['/register']);
    }
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
    this.onDestroy.next();
    // unsubscribe to ensure no memory leaks
    this.errorSubscription.unsubscribe();
  }
}
