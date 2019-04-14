import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserPost } from '../../models/UserPost';
import { FeedService } from '../../services/feed.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig
} from '@angular/material';
import { ProductPageComponent } from '../product-page/product-page.component';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input('post') userPost: UserPost;

  constructor(private feedService: FeedService, public dialog: MatDialog) {}

  ngOnInit() {
    this.updatePostImageFd(this.userPost);
  }
  async updatePostImageFd(post: UserPost) {
    // this.postService.getImage(post.postImageAddr).then(url => {
    //   this.post_sanitizeURL = url;
    // });
  }

  postClicked() {
    this.feedService.sendMessage(this.userPost);
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '60%';
    dialogConfig.width = '80%';

    dialogConfig.data = this.userPost;

    const dialogRef = this.dialog.open(ProductPageComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
