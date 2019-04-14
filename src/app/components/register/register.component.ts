import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
//import { AlertService } from '../../_services/alert.service';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { ErrorsService } from '../../services/errors.service';
//import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
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
  minLength = 3;
  wrongPassUser: boolean = false;

  // TODO - FIXED TOUCHED INVALID CLASS
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private errorsService: ErrorsService,
    private postService: PostService
  ) {
    this.subscription = this.errorsService.getMessage().subscribe(msg => {
      this.error = msg;
    });
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      birthDate: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]]
    });
    this.loginForm = this.formBuilder.group({
      emailLogin: [''], //[Validators.required, Validators.email]],
      passwordLogin: [''] //[Validators.required, Validators.minLength(6)]]
    });

    this.onChanges();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  get l() {
    return this.loginForm.controls;
  }

  onChanges(): void {
    this.registerForm.get('username').valueChanges.subscribe(val => {
      if (val.length >= this.minLength) {
        this.userService.checkUserNameExists(val).subscribe(res => {
          this.userNameExists = res;
          this.userNameValidatorLength = false;
          console.log(res);
        });
      } else {
        this.userNameValidatorLength = true;
        this.userNameExists = false;
      }
    });

    if (this.f.email.errors) {
    }
    this.registerForm.get('email').valueChanges.subscribe(val => {
      this.userService.checkEmailExists(val).subscribe(res => {
        this.emailExists = res;
        console.log(res);
      });
    });
  }

  onSubmitRegister() {
    this.submitted = true;

    // stop here if form is invalid
    // if (this.registerForm.invalid || this.emailExists || this.userNameExists) {
    //   return;
    // }

    this.loading = true;

    let email = this.registerForm.value.email;
    let username = this.registerForm.value.username;
    let password = this.registerForm.value.password;
    let birthDate = this.registerForm.value.birthDate;
    let fullName = this.registerForm.value.fullName;

    let res = {
      email: email,
      password: password,
      userName: username,
      birthDate: birthDate,
      fullName: fullName
    };
    this.userService
      .register(res)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          //  this.alertService.success('Registration successful', true);
          this.userService.userId = data.userId;
          this.userService.username = data.username;
          console.log('im user id', data.userId, data.userName);
          this.ngOnDestroy();
          this.router.navigate(['/feed/' + data.userId]);
        },
        error => {
          if (this.error.error == 'User Collision') {
            alert('already exist');
            this.emailExists = true;
          }
        }
      );
  }

  onSubmitLogin() {
    console.log('im in login');
    let email = this.loginForm.value.emailLogin;
    console.log('im email', email);
    let password = this.loginForm.value.passwordLogin;
    let res = {
      email: email,
      password: password
    };
    console.log('in register im res', res);

    this.userService
      .login(res)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data, 'im data login form');
          //  this.alertService.success('Registration successful', true);
          this.userService.userId = data.userId;
          this.userService.username = data.username;
          console.log('im user id', data.userId, data.userName);
          this.router.navigate(['/profile/' + data.userId]);
        },
        error => {
          if (this.error.error == 'Invalid Authentication Data') {
            this.wrongPassUser = true;
            console.log('im wrongpass', this.wrongPassUser);
          }
        }
      );
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
