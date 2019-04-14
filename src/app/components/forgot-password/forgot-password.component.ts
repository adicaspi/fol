import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorsService } from '../../services/errors.service';
import { Subscription } from 'rxjs';
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

  submitted = false;
  submittedreset = false;
  valid: boolean = false;
  userEmail: string;
  wrongPassUser: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private errorsService: ErrorsService
  ) {
    this.subscription = this.errorsService.getMessage().subscribe(msg => {
      this.error = msg;
    });
  }

  ngOnInit() {
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

  onSubmitForm() {
    this.submitted = true;

    if (this.forgotPassForm.status == 'VALID') {
      console.log(this.forgotPassForm.status, 'in valid');

      let email = this.forgotPassForm.value.email;
      console.log('im email', email);
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
            console.log('im wrongpass', this.wrongPassUser);
          }
        }
      );
    }
  }

  checkPasswords(form: FormGroup) {
    let pass = form.controls.password.value;
    let confirmPass = form.controls.confirmPassword.value;
    console.log(' in check pass', confirmPass);

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
