import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import * as $ from 'jquery';
import { User } from '../../models/User';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { UserDetails } from '../../models/UserDetails';
import * as EXIF from 'exif-js';

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
  postImage: any;
  emailError = false;


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
        email: ['', [Validators.required, Validators.email]],
      }
    );

    this.changePasswordForm = this.formBuilder.group(
      {
        oldPass: ['', [Validators.required]],
        newPass: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*?[0-9])(?=.*?[A-Z]).+$')]],
        confirmPass: ['']
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
      this.postImage = this.user.profileImageAddr;
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

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(this.postImage = reader.result);
    reader.onerror = error => reject(error);
  })


  async onFileSelected(event) {
    this.loading = false;
    this.selectedFile = <File>event.target.files[0];
    // checking the file isn't null
    if (this.selectedFile) {
      this.updateImageProfile = true;
      await this.toBase64(this.selectedFile).then((value) => {
        console.log(value);
        // expected output: "Success!"
      });
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
      this.emailError = false;
      this.userService.updateEmail(updatedEmail).subscribe(res => {
        this.showSuccessMsg = true;
        this.loading = false;
      }, error => {
        this.loading = false;
        this.showFailMsg = true;
        this.emailError = true;
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
        console.log(error);
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

  setImgOrientation(file, inputBase64String) {
    return new Promise((resolve, reject) => {
      const that = this;
      EXIF.getData(file, function () {
        if (this && this.exifdata && this.exifdata.Orientation) {
          that.resetOrientation(inputBase64String, this.exifdata.Orientation, function
            (resetBase64Image) {
            inputBase64String = resetBase64Image;
            resolve(inputBase64String);
          });
        } else {
          resolve(inputBase64String);
        }
      });
    });
  }

  resetOrientation(srcBase64, srcOrientation, callback) {
    const img = new Image();

    img.onload = function () {
      const width = img.width,
        height = img.height,
        canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

      // set proper canvas dimensions before transform & export
      if (4 < srcOrientation && srcOrientation < 9) {
        canvas.width = height;
        canvas.height = width;
      } else {
        canvas.width = width;
        canvas.height = height;
      }

      // transform context before drawing image
      switch (srcOrientation) {
        case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
        case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
        case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
        case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
        case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
        case 7: ctx.transform(0, -1, -1, 0, height, width); break;
        case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
        default: break;
      }

      // draw image
      ctx.drawImage(img, 0, 0);

      // export base64
      callback(canvas.toDataURL());
    };

    this.user.profileImageAddr = srcBase64;
  }

  public ngOnDestroy(): void {
    this.WindowSizeSubscription.unsubscribe();
  }

}
