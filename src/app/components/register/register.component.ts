import { Component, OnInit, Optional } from '@angular/core';
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
import { DialogService } from '../../services/dialog.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
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
  wrongPassUser: boolean = false;
  private baseApiUrl = environment.BASE_API_URL;



  // TODO - FIXED TOUCHED INVALID CLASS
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private userService: UserService,
    private errorsService: ErrorsService,
    private http: HttpClient,
    private configSerivce: ConfigService,
    private dialogService: DialogService,
    @Optional() private dialogRef?: MatDialogRef<RegisterComponent>
  ) {
    if (dialogRef) {
      this.modal = true;
    }
    this.subscription = this.errorsService.getMessage().subscribe(msg => {
      this.error = msg;
    });
  }

  ngOnInit() {
    if (this.dialogRef) {
      this.dialogRef.updateSize('550px', '580px');
    }

    this.registerForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      birthDate: ['', [Validators.required, Validators.pattern('^\\d*$')]],
      username: ['', [Validators.required, Validators.minLength(3), this.cannotContainSpace]],
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
        this.userService.checkUserNameExists(val).subscribe(res => {
          this.userNameExists = res;
          this.userNameValidatorLength = false;
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
      });
    });
    this.registerForm.get('password').valueChanges.subscribe(val => {
      this.submitted = false;
    })

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
          this.router.navigate(['feed-discover-people']);
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
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogService.openModalWindow(RegisterComponent);
    }
    else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
