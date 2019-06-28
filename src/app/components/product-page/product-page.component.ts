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

  constructor(
    private userService: UserService,
    private feedService: FeedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProductPageComponent>,
    private postService: PostService
  ) {
    this.userPost = this.data;
    this.postImageAddr = this.userPost.postImageAddr;
  }

  ngOnInit() {
    this.dialogRef.updateSize('560px', '480px');
    this.userProfileSrc = '../../../assets/placeholder.png';
    this.userService.updateUser(655);
    this.userService.user.pipe(takeUntil(this.onDestroy)).subscribe(user => {
      this.user = user;
    });
    this.getMoreFromUser();
  }

  getMoreFromUser() {
    this.feedService
      .getUserFeed(655, 0)
      .toPromise()
      .then(result => {
        let len = result.length;
        let varNum = Math.floor(Math.random() * (len + 1));
        this.posts = result.slice(0, 2);
        this.posts.forEach(post => {
          this.postService
            .getImage(post.postImageAddr)
            .pipe(takeUntil(this.onDestroy))
            .subscribe(res => {
              let image_enum = imageEnum.THUMBNAILS;
              this.createImageFromBlob(res, post, image_enum);
            });
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
