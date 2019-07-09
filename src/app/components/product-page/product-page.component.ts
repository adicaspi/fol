import { Component, OnInit, Inject } from '@angular/core';
import { UserPost } from '../../models/UserPost';
import { PostInfo } from '../../models/PostInfo';
import { FeedService } from '../../services/feed.service';
import { UserService } from '../../services/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../models/User';
import { TimelinePost } from '../../models/TimelinePost';
import { PostService } from '../../services/post.service';
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
  postInfo: PostInfo;
  timelinePost: TimelinePost;
  posts = [];
  postsToShow = [];
  user: User;
  mainImageSrc: any;
  postImageAddr: any;
  userProfileSrc: any;
  showSpinner: boolean = true;
  thumbnails = [];

  onDestroy: Subject<void> = new Subject<void>();
  private baseApiUrl = GlobalVariable.BASE_API_URL;

  constructor(
    private userService: UserService,
    private feedService: FeedService,
    private postService: PostService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProductPageComponent>
  ) {
    this.userPost = this.data;

    this.postImageAddr = this.userPost.postImageAddr;
  }

  ngOnInit() {
    this.dialogRef.updateSize('800px', '625px');
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
    this.getPostInfo();
  }

  getPostInfo() {
    this.postService
      .getPostInfo(this.data['post']['userId'], this.data['post']['postId'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(postInfo => {
        this.postInfo = postInfo;
        this.thumbnails.push(
          this.baseApiUrl + '/image?s3key=' + this.postInfo.imageAddr
        );
        if (postInfo.thumbnail1) {
          this.thumbnails.push(
            this.baseApiUrl + '/image?s3key=' + this.postInfo.thumbnail1
          );
        }
        if (postInfo.thumbnail2) {
          this.thumbnails.push(
            this.baseApiUrl + '/image?s3key=' + this.postInfo.thumbnail2
          );
        }
      });
  }

  getMoreFromUser(userId: number) {
    this.feedService
      .getUserFeed(userId, 0)
      .toPromise()
      .then(result => {
        let len = result.length;
        var i;
        for (i = 0; i < 3; i++) {
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

  setImageAndText(post) {
    var mainImageElement = $('#mainImage');
    mainImageElement.attr('src', post['imgSrc']);
    var description = $('#description');

    description.text('im nex text');
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }
}
