import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorsService } from '../../services/errors.service';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { LocationService } from '../../services/location.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  subscription: Subscription;
  error: any;
  forgotPassForm: FormGroup;
  resetPassForm: FormGroup;
  private WindowSizeSubscription: Subscription;
  submitted = false;
  submittedreset = false;
  valid: boolean = false;
  userEmail: string;
  wrongPassUser: boolean = false;
  desktop: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private errorsService: ErrorsService,
    private configService: ConfigService,
    private location: LocationService
  ) {
    this.subscription = this.errorsService.getMessage().subscribe(msg => {
      this.error = msg;
    });
  }

  ngOnInit() {
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
    this.forgotPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetPassForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        code: ['', [Validators.required]]
      },

      { validator: this.checkPasswords }
    );
  }

  get f() {
    return this.forgotPassForm.controls;
  }

  get r() {
    return this.resetPassForm.controls;
  }

  goBackPage() {
    this.location.goBack();
  }

  onSubmitForm() {
    this.submitted = true;

    if (this.forgotPassForm.status == 'VALID') {
      let email = this.forgotPassForm.value.email;
      this.userEmail = email;
      let res = {
        username: email
      };

      this.userService.resetPassword(res).subscribe(
        data => {
          this.valid = true;
        },
        error => {
          if (this.error.error == 'Invalid User') {
            this.wrongPassUser = true;
          }
        }
      );
    }
  }

  checkPasswords(form: FormGroup) {
    let pass = form.controls.password.value;
    let confirmPass = form.controls.confirmPassword.value;
    return pass === confirmPass ? null : { passwordsNotEqual: true };
  }

  onSubmitReset() {
    this.submittedreset = true;
    console.log('in submited reset');

    if (this.resetPassForm.status == 'VALID') {
      let password = this.resetPassForm.value.password;
      let code = this.resetPassForm.value.code;
      console.log('im code', code);
      let res = {
        email: this.userEmail,
        password: password,
        code: code
      };

      this.userService
        .setNewPassword(res)
        .pipe(first())
        .subscribe(data => {
          this.router.navigate(['']);
        });
    }
  }
}
