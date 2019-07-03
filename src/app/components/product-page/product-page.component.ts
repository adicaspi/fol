import { Component, OnInit, Inject } from '@angular/core';

import { UserPost } from '../../models/UserPost';
import { FeedService } from '../../services/feed.service';
import { UserService } from '../../services/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../models/User';
import { Observable } from 'rxjs';
import { TimelinePost } from '../../models/TimelinePost';
import { PostService } from '../../services/post.service';
import { imageEnum } from '../../models/imageEnum';
import * as $ from 'jquery';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalVariable } from '../../../global';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  userPost: UserPost;
  timelinePost: TimelinePost;
  posts = [];
  postsToShow = [];
  user: User;
  mainImageSrc: any;
  postImageAddr: any;
  userProfileSrc: any;
  showSpinner: boolean = true;
  onDestroy: Subject<void> = new Subject<void>();
  private baseApiUrl = GlobalVariable.BASE_API_URL;

  constructor(
    private userService: UserService,
    private feedService: FeedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProductPageComponent>
  ) {
    this.userPost = this.data;
    console.log('im data', this.data);
    this.postImageAddr = this.userPost.postImageAddr;
  }

  ngOnInit() {
    this.dialogRef.updateSize('800px', '660px');
    this.userProfileSrc = '../../../assets/placeholder.png';

    this.userService
      .getUserDetails(this.userPost['post']['userId'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(user => {
        this.user = user;
        this.userProfileSrc =
          this.baseApiUrl + '/image?s3key=' + this.user.profileImageAddr;
      });
    this.getMoreFromUser(this.userPost['post']['userId']);
  }

  // getMoreFromUser() {
  //   this.feedService
  //     .getUserFeed(655, 0)
  //     .toPromise()
  //     .then(result => {
  //       let len = result.length;
  //       var i;
  //       for (i = 0; i < 2; i++) {
  //         let varNum = Math.floor(Math.random() * (len + 1));
  //         this.posts.push(result[varNum]);
  //       }
  //       this.posts.forEach(post => {
  //         this.postService
  //           .getImage(post.postImageAddr)
  //           .pipe(takeUntil(this.onDestroy))
  //           .subscribe(res => {
  //             let image_enum = imageEnum.THUMBNAILS;
  //             this.createImageFromBlob(res, post, image_enum);
  //           });
  //       });
  //     });
  // }

  getMoreFromUser(userId: number) {
    this.feedService
      .getUserFeed(userId, 0)
      .toPromise()
      .then(result => {
        let len = result.length;
        var i;
        for (i = 0; i < 2; i++) {
          let varNum = Math.floor(Math.random() * (len + 1));
          this.posts.push(result[varNum]);
        }
        this.posts.forEach(post => {
          let baseAPI = this.baseApiUrl + '/image?s3key=';
          let postObject = {
            post: post,
            imgSrc: baseAPI + post.postImageAddr
          };
          this.postsToShow.push(postObject);
        });
      });
  }

  createImageFromBlob(image: Blob, post: UserPost, image_enum: imageEnum) {
    let reader = new FileReader();
    let handler;
    reader.addEventListener(
      'load',
      (handler = () => {
        let postObject = {
          post: post,
          imgSrc: reader.result
        };
        switch (image_enum) {
          case 0:
            this.userProfileSrc = reader.result;
            reader.removeEventListener('load', handler, false);
            break;
          case 1:
            this.mainImageSrc = reader.result;
            this.postsToShow.push(postObject);
            reader.removeEventListener('load', handler, false);
            break;

          case 2:
            this.postsToShow.push(postObject);
            reader.removeEventListener('load', handler, false);
            break;
        }
      }),
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  setImage(post) {
    console.log('im post', post);
    var mainImageElement = $('#mainImage');
    mainImageElement.attr('src', post['imgSrc']);
  }

  setImageAndText(post) {
    console.log('im post', post);
    var mainImageElement = $('#mainImage');
    mainImageElement.attr('src', post['imgSrc']);
    var description = $('#description');

    description.text('im nex text');
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }
}
