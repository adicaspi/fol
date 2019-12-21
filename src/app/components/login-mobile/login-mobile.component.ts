import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { UserService } from '../../services/user.service';
import { ConfigService } from '../../services/config.service';
import { Router } from '../../../../node_modules/@angular/router';
import { Subscription, Subject } from '../../../../node_modules/rxjs';
import { ErrorsService } from '../../services/errors.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login-mobile',
  templateUrl: './login-mobile.component.html',
  styleUrls: ['./login-mobile.component.css']
})
export class LoginMobileComponent implements OnInit {
  loginForm: FormGroup;
  errorSubscription: Subscription;
  error: any = {};
  wrongPass: boolean = false;
  wrongUser: boolean = false;
  emailMsgToShow: string = '';
  passMsgToShow: string = '';
  onDestroy: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private configSerivce: ConfigService,
    private router: Router,
    private errorsService: ErrorsService
  ) {

    this.errorSubscription = this.errorsService.getMessage().pipe(takeUntil(this.onDestroy)).subscribe(msg => {
      this.error = msg;
    });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      emailLogin: ['', Validators.required],
      passwordLogin: ['', Validators.required]
    });

  }

  get emailLogin() {
    return this.loginForm.get('emailLogin');
  }

  get passwordLogin() {
    return this.loginForm.get('passwordLogin');
  }

  get l() {
    return this.loginForm.controls;
  }

  onSubmitLogin() {
    console.log(this.loginForm.valid);
    if (this.loginForm.valid) {
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
        .subscribe(
          data => {
            this.userService.userId = data.userId;
            this.userService.username = data.username;
            this.userService.updateUser(data.userId);

            this.configSerivce.setSessionStorage(data.userId.toString());
            this.router.navigate(['/feed/' + data.userId]);
            this.ngOnDestroy();
          },
          error => {

            if (this.error.error == 'Invalid Authentication Data') {
              console.log("in login comp msg recived");
              this.wrongPass = true;
              this.passMsgToShow = 'The password you entered is incorrect.'
            }
            if (this.error.error == 'Invalid User') {
              this.wrongUser = true;
              this.emailMsgToShow = "Username doesn't exist."

            }
          }
        );
    }
    else {
      console.log("not valid");
    }
  }

  regsiterPage() {
    //this.dialogService.openModalWindow(RegisterComponent);
  }

  ngOnDestroy() {
    this.onDestroy.next();
    // unsubscribe to ensure no memory leaks
    this.errorSubscription.unsubscribe();
  }


}
