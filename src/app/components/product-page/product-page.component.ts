import { Component, OnInit, Inject } from '@angular/core';
import { Subscription, BehaviorSubject, Observer } from 'rxjs';
import { UserPost } from '../../models/UserPost';
import { FeedService } from '../../services/feed.service';
import { UserService } from '../../services/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../models/User';
import { Observable } from 'rxjs/Observable';
import { TimelinePost } from '../../models/TimelinePost';
import { DialogService } from '../../services/dialog.service';
import { PostService } from '../../services/post.service';
import * as Rx from 'rxjs';
import * as $ from 'jquery';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  userPost: UserPost;
  timelinePost: TimelinePost;
  posts = [];
  imagesToShow = [];
  user: Observable<User>;
  mainImageSrc: any;
  postImageAddr: any;
  showSpinner: boolean = true;

  constructor(
    private userService: UserService,
    private feedService: FeedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProductPageComponent>,
    private dialogService: DialogService,
    private postService: PostService
  ) {
    this.userPost = this.data;
    this.postImageAddr = this.userPost.postImageAddr;
  }

  ngOnInit() {
    this.dialogRef.updateSize('580px', '480px');
    this.updateUser();
    this.updatePostImageFd(this.postImageAddr).subscribe(res => {
      this.createImageFromBlob(res, true);
    });
    this.getMoreFromUser();
  }
  updateUser() {
    this.user = this.userService.user;
  }

  getMoreFromUser() {
    this.feedService
      .getUserFeed(655, 0)
      .toPromise()
      .then(result => {
        this.posts = result.slice(0, 2);
        this.posts.forEach(post => {
          this.postService.getImage(post.postImageAddr).subscribe(res => {
            this.createImageFromBlob(res, false);
          });
        });
      });
  }

  changeDialog(userPost: UserPost) {
    this.userPost = userPost;
    console.log('in change dialog');
    this.dialogRef.close();
    this.dialogService.openDialog(ProductPageComponent, this.userPost);
  }

  createImageFromBlob(image: Blob, main: boolean) {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        if (main) {
          this.mainImageSrc = reader.result;
          this.imagesToShow.push(this.mainImageSrc);
        } else {
          this.imagesToShow.push(reader.result);
        }
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  updatePostImageFd(postImageAddr: string): Observable<Blob> {
    console.log('in post service');
    return this.postService.getImage(postImageAddr);
  }

  setImage(src) {
    var mainImageElement = $('#mainImage');
    mainImageElement.attr('src', src);
  }

  setImageAndText(src) {
    var mainImageElement = $('#mainImage');
    mainImageElement.attr('src', src);
    var description = $('#description');
    description.text('im nex text');
  }
}
