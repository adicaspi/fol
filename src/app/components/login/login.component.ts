import { Component, OnInit, Optional, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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
import { Title, Meta } from '@angular/platform-browser';
import { Overlay } from '../../../../node_modules/@angular/cdk/overlay';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  errorSubscription: Subscription;
  error: any = {};
  loginForm: FormGroup;
  submitted: boolean = false;
  userId: number;
  wrongPass: boolean = false;
  wrongUser: boolean = false;
  modal: boolean;
  msgToShow: string;
  onDestroy: Subject<void> = new Subject<void>();
  title = 'Login';
  desktop: boolean;
  previousUrl: string;
  showCloseButton: boolean = true;
  register: string = "register";
  loading = false;
  ios: boolean = false;
  private WindowSizeSubscription: Subscription;
  facebookLoginEndpoint: string = environment.loginWithFbUrl;
  private baseApiUrl = environment.BASE_API_URL;
  private autoLogin = this.baseApiUrl + '/registration/auto-login';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private errorsService: ErrorsService,
    private http: HttpClient,
    private configSerivce: ConfigService,
    private configService: ConfigService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private titleService: Title,
    private meta: Meta,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() private dialogRef: MatDialogRef<LoginComponent>

  ) {
    if (dialogRef) {
      this.modal = true;
      this.dialogRef
      dialogRef.addPanelClass("login-panel-class");
      if (!this.data.showCloseButton) {
        this.showCloseButton = false;
      }
    }
    this.errorSubscription = this.errorsService.getMessage().pipe(takeUntil(this.onDestroy)).subscribe(msg => {
      this.error = msg;
    });
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
    this.ios = this.configService.iOS();
  }

  ngOnInit() {
    this.titleService.setTitle('Login to Followear');
    this.meta.addTag({ name: 'description', content: 'Welcome back to Followear. Create an account or log in to Followear - see the latest fashion items posted by your network' });
    this.meta.addTag({ name: 'robots', content: 'index' })
    this.loginForm = this.formBuilder.group({
      emailLogin: ['', Validators.required],
      passwordLogin: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields

  get l() {
    return this.loginForm.controls;
  }

  get loginFormValid() {
    return this.loginForm.valid;
  }

  landingPage() {
    this.router.navigate(['landing']);
  }

  forgotPassword() {
    this.dialogRef.close();
    this.router.navigate(['forgotpassword']);
  }

  onSubmitLogin() {
    this.submitted = true;
    if (!this.loginForm.valid) {
      return;
    }
    this.loading = true;
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
          if (localStorage.getItem('profile')) {
            let id = localStorage.getItem('profile');
            localStorage.clear();
            this.router.navigate(['profile', id]);
          } else {
            this.router.navigate(['/feed/' + data.userId]);
          }
        },
        error => {
          this.submitted = false;
          this.loading = false;

          if (this.error.error == 'Invalid Authentication Data') {

            this.wrongPass = true;
            this.msgToShow = 'Password or username is incorrect.'
          }
          if (this.error.error == 'Invalid User') {
            this.wrongUser = true;
            this.msgToShow = "Username doesn't exist."

          }
        }
      );
  }

  regsiterPage() {
    if (this.desktop) {
      if (!this.dialogRef) {
        this.router.navigate(['/register']);
      }
    } else {
      this.router.navigate(['/register']);
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
    // unsubscribe to ensure no memory leaks
    this.errorSubscription.unsubscribe();
  }
}
