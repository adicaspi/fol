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
    private dialogService: DialogService,
    private postService: PostService
  ) {
    this.userPost = this.data;
    this.postImageAddr = this.userPost.postImageAddr;
  }

  ngOnInit() {
    this.dialogRef.updateSize('560px', '480px');
    this.userProfileSrc = '../../../assets/placeholder.png';
    // this.updateUser();
    this.userService.user.pipe(takeUntil(this.onDestroy)).subscribe(user => {
      this.user = user;
      this.updatePostImageFd(user.profileImageAddr)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(res => {
          let image_enum = imageEnum.PROFILE;
          this.createImageFromBlob(res, this.userPost, image_enum);
        });
    });
    this.updatePostImageFd(this.postImageAddr)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(res => {
        let image_enum = imageEnum.MAIN;
        this.createImageFromBlob(res, this.userPost, image_enum);
      });

    this.getMoreFromUser();
  }

  getMoreFromUser() {
    this.feedService
      .getUserFeed(655, 0)
      .toPromise()
      .then(result => {
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

  // changeDialog(userPost: UserPost) {
  //   this.userPost = userPost;
  //   this.dialogRef.close();
  //   this.dialogService.openDialog(ProductPageComponent, this.userPost);
  // }

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

  updatePostImageFd(postImageAddr: string): Observable<Blob> {
    return this.postService.getImage(postImageAddr);
  }

  setImage(src) {
    var mainImageElement = $('#mainImage');
    mainImageElement.attr('src', src);
  }

  setImageAndText(post) {
    var mainImageElement = $('#mainImage');
    mainImageElement.attr('src', post['imgSrc']);
    var description = $('#description');
    //description.text(post['post']['description']);
    description.text('im nex text');
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }
}
