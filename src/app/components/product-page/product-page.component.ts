import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserPost } from '../../models/UserPost';
import { FeedService } from '../../services/feed.service';
import { UserService } from '../../services/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../models/User';
import { Observable } from 'rxjs/Observable';
import { TimelinePost } from '../../models/TimelinePost';
@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  subscription: Subscription;
  userPost: UserPost;
  timelinePost: TimelinePost;
  loaded: boolean = false;
  addr: string;
  posts = [];

  class: string;
  user: Observable<User>;
  constructor(
    private userService: UserService,
    private feedService: FeedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProductPageComponent>
  ) {
    this.userPost = this.data;
  }

  ngOnInit() {
    this.dialogRef.updateSize('550px', '430px');
    this.updateUser();
    this.getMoreFromUser();
  }
  updateUser() {
    this.user = this.userService.user;
  }

  getMoreFromUser() {
    // this.feedService.getUserFeed(this.userPost.userId, 0);
    //this.feedService.getUserFeed.getTimeLineFeed(this.timelinePost.userId,0);
    this.feedService
      .getUserFeed(655, 0)
      .toPromise()
      .then(result => {
        this.posts = result.slice(0, 2);

        console.log('im sliced posts', this.posts);
      });
  }
}
