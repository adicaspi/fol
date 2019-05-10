import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserPost } from '../../models/UserPost';
import { FeedService } from '../../services/feed.service';
import { UserService } from '../../services/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../models/User';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  subscription: Subscription;
  userPost: UserPost;
  loaded: boolean = false;

  showSpinner: boolean = true;
  user: Observable<User>;
  constructor(
    private feedService: FeedService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProductPageComponent>
  ) {
    this.userPost = this.data;
  }

  ngOnInit() {
    this.updateUser();
    if (this.user) {
      this.loaded = true;
      console.log('im user post', this.user);
    }
  }
  updateUser() {
    this.user = this.userService.user;
  }
}
