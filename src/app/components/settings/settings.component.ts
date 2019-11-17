import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import * as $ from 'jquery';
import { User } from '../../models/User';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
  user: User;
  description: string;
  descriptionInputChanged: boolean = false;
  selectedFile: File = null;
  submitted: boolean = false;
  updateImageProfile: boolean = false;
  fields = [];
  profileClass = 'controlers profile';
  passClass = 'controlers password';
  spanClass = 'user';
  userInfoClass = 'user-info';
  section: string;
  button_text: string;
  submittedPass: boolean = false;
  onDestroy: Subject<void> = new Subject<void>();

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
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
        oldPass: ['', Validators.minLength(6)],
        newPass: ['', Validators.minLength(6)],
        confirmPass: ['', Validators.required]
      },
      {
        validator: this.MustMatch('newPass', 'confirmPass')
      }

    )
    this.updateUser();
    this.editProfile();
  }

  get f() {
    return this.settingsForm.controls;
  }

  updateUser() {
    this.userService.user.pipe(takeUntil(this.onDestroy)).subscribe(user => {
      this.user = user;
      this.patchValue(this.user);
    });
  }

  updateUserDescription(description: string) {

  }

  patchValue(user: User) {
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
    this.button_text = 'Submit';
    this.section = 'profile';
    this.profileClass = 'controlers profile-clicked';
    this.passClass = 'controlers password';
    this.spanClass = 'user';
    this.userInfoClass = 'user-info';
  }

  changePassword() {
    this.section = 'password';
    this.button_text = 'Change Password';
    this.passClass = 'controlers password-clicked';
    this.profileClass = 'controlers profile';
    this.spanClass = 'user pass';
    this.userInfoClass = 'user-info-pass';
  }

  MustMatch(controlName: string, matchingControlName: string) {
    console.log('in must match');
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
    if (this.settingsForm.invalid) {
      return;
    }
    let oldPassForm = this.f.oldPass;
    let newPassForm = this.f.newPass;
    let confirmPassForm = this.settingsForm.value.oldPass;
    if (confirmPassForm != newPassForm) {
    }
    let res = {
      oldPass: oldPassForm,
      newPass: newPassForm,
      confirmPass: confirmPassForm
    };
  }

  onSubmit() {
    console.log("in sumbit");
    this.submitted = true;

    let updatedDescription = this.settingsForm.get('description').value;
    if (updatedDescription != this.user.description) {
      this.userService.updateUserDescription(updatedDescription);
    }
    if (this.updateImageProfile) {
      const fd = new FormData();
      fd.append('image', this.selectedFile, this.selectedFile.name);
      this.userService.updateProfileImage(fd).subscribe(res => {

      });
    }
  }
}
