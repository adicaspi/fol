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
  subscription: Subscription;
  userPost: UserPost;
  timelinePost: TimelinePost;
  loaded: Rx.Subject<any>;
  postloaded: boolean = false;
  addr: string;
  posts = [];
  ImageSrcFirstThumbnail: any;
  ImageSrcSecondThumbnail: any;
  class: string;
  user: Observable<User>;
  postImageSrc: any;
  postImageAddr: any;
  first: boolean = false;
  second: boolean = false;
  third: boolean = false;
  showSpinner: boolean = true;
  display_val = 'none';
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
    // (550,430)
    this.updateUser();
    this.updatePostImageFd(this.postImageAddr).subscribe(res => {
      this.createImageFromBlob(res).subscribe(img => {
        this.postImageSrc = img;
        this.first = true;
        if (this.first && this.second && this.third) {
          this.showSpinner = false;
        }
      });
    });
    this.getMoreFromUser();
  }
  updateUser() {
    this.user = this.userService.user;
  }

  getMoreFromUser() {
    console.log('in get more');
    this.feedService
      .getUserFeed(655, 0)
      .toPromise()
      .then(result => {
        this.posts = result.slice(0, 2);
        console.log('in get more after posts');

        this.updatePostImageFd(this.posts[0].postImageAddr).subscribe(res => {
          this.createImageFromBlob(res).subscribe(img => {
            this.ImageSrcFirstThumbnail = img;
            this.second = true;
            if (this.first && this.second && this.third) {
              this.showSpinner = false;
            }
          });
        });
        this.updatePostImageFd(this.posts[1].postImageAddr).subscribe(res => {
          this.createImageFromBlob(res).subscribe(img => {
            this.ImageSrcSecondThumbnail = img;
            this.third = true;
            if (this.first && this.second && this.third) {
              this.showSpinner = false;
            }
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

  createImageFromBlob(image: Blob): Observable<any> {
    return new Observable<any>(observer => {
      // This is a tiny blank image
      observer.next(image);

      // The next and error callbacks from the observer
      const { next, error } = observer;

      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = function() {
        observer.next(reader.result);
      };

      return { unsubscribe() {} };
    });
  }

  updatePostImageFd(postImageAddr: string): Observable<Blob> {
    console.log('in post service');
    return this.postService.getImage(postImageAddr);
    // .subscribe(data => {
    //   console.log('im data from post servcie', data);
    //   this.createImageFromBlob(data).subscribe(res => {
    //     imgSrc = res;
    //   }),
    //     error => {
    //       console.log('error in loading image', error);
    //     };
    // });
  }

  setImage(src) {
    var mainImageElement = $('#mainImage');
    mainImageElement.attr('src', src);
  }
}
