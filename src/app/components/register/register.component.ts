import { Component, OnInit, Optional, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user.service';
import { ErrorsService } from '../../services/errors.service';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../services/config.service';
import { DatePipe } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { LoginComponent } from '../login/login.component';
import { Overlay } from '../../../../node_modules/@angular/cdk/overlay';
import * as jquery from 'jquery';
import * as $ from 'jquery';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [DatePipe]
})
export class RegisterComponent implements OnInit {
  subscription: Subscription;
  error: any;
  registerForm: FormGroup;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  userId: number;
  userNameExists = false;
  userNameValidatorLength = false;
  emailExists = false;
  modal: boolean = false;
  minLength = 3;
  showCloseButton: boolean = true;
  login = "login";
  wrongPassUser: boolean = false;
  containSpace: boolean = false;
  termsLink: string = "https://www.followear.com/terms"
  cookiesLink: string = "https://www.followear.com/cookies-policy"
  private baseApiUrl = environment.BASE_API_URL;
  facebookLoginEndpoint: string = environment.loginWithFbUrl;
  title = 'Register to Followear';
  private WindowSizeSubscription: Subscription;
  desktop: boolean;


  // TODO - FIXED TOUCHED INVALID CLASS
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private userService: UserService,
    private errorsService: ErrorsService,
    private configService: ConfigService,
    private configSerivce: ConfigService,
    private titleService: Title,
    private meta: Meta,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() private dialogRef?: MatDialogRef<RegisterComponent>
  ) {
    if (dialogRef) {
      this.modal = true;
      dialogRef.addPanelClass("login-panel-class");
      if (!this.data.showCloseButton) {
        this.showCloseButton = false;
      }
    }
    this.subscription = this.errorsService.getMessage().subscribe(msg => {
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
    this.titleService.setTitle('Register to Followear');
    this.meta.addTag({ name: 'description', content: "Join Followear! Sign up to see fashion items from your favorite stores" });
    this.meta.addTag({ name: 'robots', content: 'index' });
    this.registerForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      birthDate: ['', [Validators.required, Validators.pattern('^\\d*$')]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9_.]+$')], this.validateUserNameNotTaken.bind(this)],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*?[0-9])(?=.*?[A-Z]).+$')]]
      ,
      email: ['', [Validators.required, Validators.email]]
    });

    this.onChanges();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  get registerFormValid() {
    return this.registerForm.valid;
  }

  onChanges(): void {

    this.registerForm.get('username').valueChanges.subscribe(val => {
      if (val.length >= this.minLength) {
        if (val.indexOf(' ') > 0) {
          this.containSpace = true;
        } else {
          this.containSpace = false;
        }
        // this.userService.checkUserNameExists(val).subscribe(res => {
        //   this.userNameExists = res;
        //   this.userNameValidatorLength = false;
        // });
      } else {
        this.userNameValidatorLength = true;
        this.userNameExists = false;
      }
    });

    if (this.f.email.errors) {
    }
    this.registerForm.get('email').valueChanges.subscribe(val => {
      this.submitted = false;
      this.userService.checkEmailExists(val).subscribe(res => {
        this.emailExists = res;
      });
    });
    this.registerForm.get('username').valueChanges.subscribe(val => {
      this.submitted = false;
    });
    this.registerForm.get('password').valueChanges.subscribe(val => {
      this.submitted = false;
    });


  }

  validateUserNameNotTaken(control: AbstractControl) {
    return this.userService.checkUserNameExists(control.value).map(res => {
      return res ? { usernameTaken: true } : null;
    });
  }

  calculateBirthdate(age: string) {
    let today = new Date();
    let correctDateFormat = this.datePipe.transform(today, '-MM-dd');
    let yyyy = this.datePipe.transform(today, 'yyyy');
    let numericYear = parseInt(yyyy, 10);
    let numericAge = parseInt(age, 10);
    let year = numericYear - numericAge;
    let stringYear = year.toString();
    let birthDate = stringYear + correctDateFormat;
    return birthDate;

  }

  cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if ((control.value as string).indexOf(' ') >= 0) {
      return { cannotContainSpace: true }
    }

    return null;

  }

  onSubmitRegister() {
    this.submitted = true;
    // stop here if form is invalid
    if (!this.registerForm.valid) {

      return;
    }

    this.loading = true;
    let email = this.registerForm.value.email;
    let username = this.registerForm.value.username;
    let password = this.registerForm.value.password;
    let age = this.registerForm.value.birthDate;
    let fullName = this.registerForm.value.fullName;
    let birthDate = this.calculateBirthdate(age);

    let res = {
      email: email,
      password: password,
      userName: username,
      birthDate: birthDate,
      fullName: fullName
    };
    this.userService
      .register(res)
      .subscribe(
        data => {
          this.userService.userId = data.userId;
          this.userService.username = data.username;
          this.userService.updateUser(data.userId);
          this.configSerivce.setSessionStorage(data.userId.toString());
          if (localStorage.getItem('profile')) {
            this.router.navigate(['profile', localStorage.getItem('profile')]);
            localStorage.removeItem('profile')
          } else {
            this.router.navigate(['feed-discover-people']);
          }

          this.dialogRef.close();
          this.ngOnDestroy();
        },
        error => {
          this.loading = false;
          if (this.error.error == 'User Collision') {
            this.emailExists = true;
          }
        }
      );
  }

  loginPage(): void {
    if (!this.dialogRef) {
      this.router.navigate(['/login']);
    }
  }

  landingPage() {
    this.router.navigate(['landing']);
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
