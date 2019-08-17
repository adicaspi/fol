import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import * as $ from 'jquery';

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
  description: string;
  selectedFile: File = null;
  submitted: boolean = false;
  updateImageProfile: boolean = false;
  fields = [];
  profileClass = 'controlers profile';
  passClass = 'controlers password';
  //profileClass = $('li.controlers.profile');
  //passwordClass = $('li.controlers.password');

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.settingsForm = this.formBuilder.group({
      description: [''],
      bio: [''],
      oldPass: ['', Validators.minLength(8)],
      newPass: ['', Validators.minLength(8)],
      confirmPass: [''],
      post: [''],
      post_description: ['']
    });
    this.editProfile();
  }

  get f() {
    return this.settingsForm.controls;
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    // checking the file isn't null
    if (this.selectedFile) {
      this.updateImageProfile = true;
    }
  }

  editProfile() {
    this.profileClass = 'controlers profile-clicked';
    this.passClass = 'controlers password';
    var desc = new fieldItem();
    desc.display = 'Description';
    desc.input = 'description';
    desc.label = 'description';
    var bio = new fieldItem();
    bio.display = 'Bio';
    bio.input = 'bio';
    bio.label = 'bio';
    this.fields = [desc, bio];
    //this.fields = ['description', 'bio'];
  }

  changePassword() {
    this.passClass = 'controlers password-clicked';
    this.profileClass = 'controlers profile';
    var oldPass = new fieldItem();
    oldPass.display = 'New Password';
    oldPass.input = 'oldPass';
    oldPass.label = 'oldPass';
    var newPass = new fieldItem();
    newPass.display = 'Old Password';
    newPass.input = 'newPass';
    newPass.label = 'newPass';
    var confirmPass = new fieldItem();
    confirmPass.display = 'Confirm New Password';
    confirmPass.input = 'confirmPass';
    confirmPass.label = 'confirmPass';
    this.fields = [oldPass, newPass, confirmPass];
  }

  onSubmit() {
    this.submitted = true;
    let description = this.settingsForm.get('description').value;
    let post_description = this.settingsForm.get('post_description').value;
    this.userService.updateUserDescription(description);
    if (this.updateImageProfile) {
      const fd = new FormData();
      fd.append('image', this.selectedFile, this.selectedFile.name);
      console.log(fd);
      this.userService.uploadPost(fd, post_description).subscribe(res => {
        console.log(res);
      });
    }
  }
}
