import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import * as $ from 'jquery';
import { User } from '../../models/User';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { UserDetails } from '../../models/UserDetails';

class fieldItem {
  label: string;
  display: string;
  input: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  changePasswordForm: FormGroup;
  user: UserDetails;
  description: string;
  descriptionInputChanged: boolean = false;
  selectedFile: File = null;
  submitted: boolean = false;
  updateImageProfile: boolean = false;
  fields = [];
  profileClass = 'controlers edit-profile';
  passClass = 'controlers password';
  spanClass = 'user';
  userInfoClass = 'user-info';
  profile: boolean = true;
  password: boolean = false;
  button_text: string;
  submittedPass: boolean = false;
  desktop: boolean = true;
  loading: boolean = false;
  showSuccessMsg: boolean = false;
  showFailMsg: boolean = false;
  timeout: any;
  onDestroy: Subject<void> = new Subject<void>();
  private WindowSizeSubscription: Subscription;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.settingsForm = this.formBuilder.group(
      {
        username: [{ value: '', disabled: true }],
        fullname: [''],
        description: [''],
        email: [''],
      }
    );

    this.changePasswordForm = this.formBuilder.group(
      {
        oldPass: ['', [Validators.required, Validators.minLength(6)]],
        newPass: ['', [Validators.required, Validators.minLength(6)]],
        confirmPass: ['', [Validators.required, Validators.minLength(6)]]
      },
      {
        validator: this.MustMatch('newPass', 'confirmPass')
      }

    )
    this.updateUser();
    this.editProfile();
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

  get f() {
    return this.settingsForm.controls;
  }

  get changePassForm() {
    return this.changePasswordForm.controls;
  }

  updateUser() {
    this.userService.user.pipe(takeUntil(this.onDestroy)).subscribe(user => {
      this.user = user;
      this.patchValue(this.user);
    });
  }

  updateUserDescription(description: string) {

  }

  patchValue(user: UserDetails) {
    this.settingsForm.patchValue({
      username: user.username,
      fullname: user.fullName,
      description: user.description,
      email: user.email
    });
  }
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    // checking the file isn't null
    if (this.selectedFile) {
      this.updateImageProfile = true;
    }
  }

  editProfile() {
    this.profile = true;
    this.password = false;
    this.button_text = 'Submit';
    this.profileClass = 'controlers profile-clicked';
    this.passClass = 'controlers password';
    this.spanClass = 'user';
    this.userInfoClass = 'user-info';
  }

  changePassword() {
    this.password = true;
    this.profile = false;
    this.button_text = 'Change Password';
    this.passClass = 'controlers password-clicked';
    this.profileClass = 'controlers edit-profile';
    this.spanClass = 'user pass';
    this.userInfoClass = 'user-info-pass';
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onSubmitChangePassword() {
    this.submittedPass = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.loading = true;
    let oldPassForm = this.changePasswordForm.value.oldPass;
    let newPassForm = this.changePasswordForm.value.newPass;

    let res = {
      oldPassword: oldPassForm,
      newPassword: newPassForm,
    };
    this.userService.changePassword(res).subscribe(res => {
      this.showSuccessMsg = true;
      this.loading = false
    }, error => {
      this.loading = false;
      this.showFailMsg = true;
    });
    this.hideMessage();
  }

  onSubmit() {
    this.submitted = true;

    let updatedDescription = this.settingsForm.value.description;
    let updatedFullName = this.settingsForm.value.fullname;
    let updatedEmail = this.settingsForm.value.email;
    if (updatedDescription != this.user.description) {
      this.loading = true;
      this.userService.updateUserDescription(updatedDescription).subscribe(res => {
        this.showSuccessMsg = true;
        this.loading = false;
      }, error => {
        this.loading = false;
        this.showFailMsg = true;
      });
    }
    if (updatedFullName != this.user.fullName) {
      this.loading = true;
      this.userService.updateFullname(updatedFullName).subscribe(res => {
        this.showSuccessMsg = true;
        this.loading = false;
      }, error => {
        this.loading = false;
        this.showFailMsg = true;
      });
    }
    if (updatedEmail != this.user.email) {
      this.loading = true;
      this.userService.updateEmail(updatedEmail).subscribe(res => {
        this.showSuccessMsg = true;
        this.loading = false;
      }, error => {
        this.loading = false;
        this.showFailMsg = true;
      });
    }

    if (this.updateImageProfile) {
      this.loading = true;
      const fd = new FormData();
      fd.append('image', this.selectedFile, this.selectedFile.name);
      this.userService.updateProfileImage(fd).subscribe(res => {
        this.showSuccessMsg = true;
        this.loading = false;
      }, error => {
        this.loading = false;
        //this.showFailMsg = true;
      });
    }
    this.hideMessage();

  }

  hideMessage() {
    this.timeout = setTimeout(() => {
      this.showSuccessMsg = false;
      this.showFailMsg = false;
    }, 2000);
  }

  public ngOnDestroy(): void {
    this.WindowSizeSubscription.unsubscribe();
  }

}
