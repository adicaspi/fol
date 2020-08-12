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
  private WindowSizeSubscription: Subscription;
  facebookLoginEndpoint: string = "https://localauth.followear.com/oauth2/authorize?identity_provider=Facebook&redirect_uri=https://www.followear.com&response_type=CODE&client_id=k60gq4qju60fgadkps8obq59h&scope=email%20openid";
  private baseApiUrl = environment.BASE_API_URL;
  private autoLogin = this.baseApiUrl + '/registration/auto-login';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private errorsService: ErrorsService,
    private http: HttpClient,
    private configSerivce: ConfigService,
    //private dialogService: DialogService,
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
  }

  ngOnInit() {
    this.titleService.setTitle('Login to Followear');
    this.meta.addTag({ name: 'description', content: 'Welcome back to Followear. Create an account or log in to Followear - see the latest fashion items posted by your network' });
    this.meta.addTag({ name: 'robots', content: 'index' })
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

  landingPage() {
    this.router.navigate(['landing']);
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
    if (!this.dialogRef) {
      this.router.navigate(['/register']);
    }
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
