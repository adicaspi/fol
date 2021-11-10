import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
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
  termsClass = 'controlers terms'
  profile: boolean = true;
  password: boolean = false;
  terms: boolean = false;
  button_text: string;
  submittedPass: boolean = false;
  desktop: boolean = true;
  loading: boolean = false;
  showSuccessMsg: boolean = false;
  showFailMsg: boolean = false;
  timeout: any;
  termsLink: string = "https://www.followear.com/terms"
  cookiesLink: string = "https://www.followear.com/cookies-policy"
  privacyLink: string = "https://www.followear.com/privacy-policy"
  onDestroy: Subject<void> = new Subject<void>();
  private WindowSizeSubscription: Subscription;
  postImage: any;
  emailError = false;
  minLength = 3;
  containSpace: boolean = false;
  userNameExists = false;
  userNameValidatorLength = false;


  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.settingsForm = this.formBuilder.group(
      {
        username: ['', [Validators.pattern('^[a-zA-Z0-9_.]+$'), Validators.required],
          this.validateUserNameNotTaken.bind(this)
        ],
        fullname: [''],
        description: [''],
        email: ['', [Validators.required, Validators.email]],
      },

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
    this.onChanges();
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

  onChanges(): void {
    this.settingsForm.get('username').valueChanges.subscribe(val => {
      if (val.length >= this.minLength) {
        if (val.indexOf(' ') > 0) {
          this.containSpace = true;
        } else {
          this.containSpace = false;
        }
      } else {
        this.userNameValidatorLength = true;
        this.userNameExists = false;
      }
    });
    this.settingsForm.get('username').valueChanges.subscribe(val => {
      this.submitted = false;
    })
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
    this.terms = false;
    this.button_text = 'Submit';
  }

  changePassword() {
    this.password = true;
    this.profile = false;
    this.terms = false;
    this.button_text = 'Change Password';
  }

  seeTerms() {
    this.password = false;
    this.profile = false;
    this.terms = true;
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

  validateUserNameNotTaken(control: AbstractControl) {
    return this.userService.checkUserNameExists(control.value).map(res => {
      if (this.user.username == control.value) {
        return { usernameTaken: false }
      } else {
        return res ? { usernameTaken: true } : null;
      }
    });
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
    if (!this.settingsForm.valid) {
      return;
    }
    this.submitted = true;
    let updatedUserName = this.settingsForm.value.username;
    let updatedDescription = this.settingsForm.value.description;
    let updatedFullName = this.settingsForm.value.fullname;
    let updatedEmail = this.settingsForm.value.email;
    if (updatedUserName != this.user.username) {
      this.loading = true;
      this.userService.updateUsername(updatedUserName).subscribe(res => {
        this.showSuccessMsg = true;
        this.loading = false;
      }, error => {
        console.log(error);
        if (error == 'User Collision') {
          this.userNameExists = true;
        }
        this.loading = false;
        this.showFailMsg = true;
      });
    }
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

  // setImgOrientation(file, inputBase64String) {
  //   return new Promise((resolve, reject) => {
  //     const that = this;
  //     EXIF.getData(file, function () {
  //       if (this && this.exifdata && this.exifdata.Orientation) {
  //         that.resetOrientation(inputBase64String, this.exifdata.Orientation, function
  //           (resetBase64Image) {
  //           inputBase64String = resetBase64Image;
  //           resolve(inputBase64String);
  //         });
  //       } else {
  //         resolve(inputBase64String);
  //       }
  //     });
  //   });
  // }

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
