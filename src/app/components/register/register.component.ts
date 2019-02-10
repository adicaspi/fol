import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

//import { AlertService } from '../../_services/alert.service';
import { UserService } from '../../services/user.service';
//import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  userId: number;
  userNameExists = false;
  userNameValidatorLength = false;
  emailExists = false;
  minLength = 3;
  // TODO - FIXED TOUCHED INVALID CLASS
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService //private alertService: AlertService, //private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      birthDate: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]]
    });
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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
          this.router.navigate(['/feed/' + data.userId]);
        },
        error => {
          //this.alertService.error(error);
          console.log('im error', error);
          this.loading = false;
        }
      );
  }

  onSubmitLogin() {
    let email = this.loginForm.value.email;
    let password = this.loginForm.value.password;
    let res = {
      email: email,
      password: password
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
          this.router.navigate(['/feed/' + data.userId]);
        },
        error => {
          //this.alertService.error(error);
          console.log('im error', error);
          this.loading = false;
        }
      );
  }
}
