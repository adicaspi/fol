import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

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

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.settingsForm = this.formBuilder.group({
      description: [''],
      password: ['', Validators.minLength(8)],
      post: [''],
      post_description: ['']
    });
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

  // onUpload() {
  //   let desc = '';
  //   const fd = new FormData();
  //   fd.append('image', this.selectedFile, this.selectedFile.name);
  //   console.log(fd);

  //   this.userService.uploadPost(fd, desc).subscribe(res => {
  //     console.log(res);
  //   });
  // }

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
