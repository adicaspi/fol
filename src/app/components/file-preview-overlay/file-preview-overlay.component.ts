import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FeedService } from '../../services/feed.service';
import { DialogService } from '../../services/dialog.service';
import { UserPost } from '../../models/UserPost';
import { PostInfo } from '../../models/PostInfo';
import { UserService } from '../../services/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../models/User';
import { TimelinePost } from '../../models/TimelinePost';
import { PostService } from '../../services/post.service';
import * as $ from 'jquery';
import * as jquery from 'jquery';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FilePreviewOverlayRef } from './file-preview-overlay-ref';
import { MorePosts } from '../../models/MorePosts';
import { ConfigService } from '../../services/config.service';
import { ThousandSuffixesPipe } from '../../models/pipe-transform';

@Component({
  selector: 'app-file-preview-overlay',
  templateUrl: './file-preview-overlay.component.html',
  styleUrls: ['./file-preview-overlay.component.css']
})
export class FilePreviewOverlayComponent implements OnInit {
  showSpinner: boolean = true;
  userPost: UserPost;
  postInfo: PostInfo;
  timelinePost: TimelinePost;
  storeLogoSrc: string;
  postsToShow: Observable<MorePosts[]>;
  user: User;
  mainImageSrc: any;
  postImageAddr: any;
  userProfileSrc: any;
  thumbnails = [];
  postId: number;
  userPostUserId: number;
  numLikes: number;
  userProfile: boolean = false;
  likeButtonClicked: boolean = false;
  registeredUser: boolean = false;
  pipeTransform: ThousandSuffixesPipe = new ThousandSuffixesPipe();
  onDestroy: Subject<void> = new Subject<void>();
  private baseApiUrl = environment.BASE_API_URL;
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private postService: PostService,
    private dialogRef: FilePreviewOverlayRef
  ) {
  }

  ngOnInit() {
    if (this.userService.userId) {
      this.registeredUser = true;
    }
    this.postId = this.configService.getGeneralSession('product_id');
    this.userPostUserId = this.configService.getGeneralSession('user_id_post_id');
    this.getPostInfo();
    this.getMoreFromUser();
    this.userProfileSrc = '../../../assets/placeholder.png';
  }

  getPostInfo() {
    this.postService
      .getMobilePostInfo(this.userService.userId, this.postId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(postInfo => {
        this.postInfo = postInfo;
        if (this.postInfo.userId == this.userService.userId) {
          this.userProfile = true;
        }
        if (this.registeredUser) {
          this.didLike();
        }
        this.postImageAddr = this.postInfo.postImageAddr;
        this.numLikes = this.pipeTransform.transform(postInfo.numLikes);
        this.thumbnails.push(
          this.baseApiUrl + '/image?s3key=' + this.postInfo.postImageAddr
        );
        if (this.postInfo.thumbnailAddr) {
          this.thumbnails.push(
            this.baseApiUrl + '/image?s3key=' + this.postInfo.thumbnailAddr
          );
        }
        this.storeLogoSrc = this.baseApiUrl + '/image?s3key=' + this.postInfo.storeLogoAddr;
        this.userProfileSrc = this.baseApiUrl + '/image?s3key=' + this.postInfo.userProfileImageAddr;
        this.postImageAddr = this.baseApiUrl + '/image?s3key=' + this.postInfo.postImageAddr;
        this.showSpinner = false;
      });

  }

  getMoreFromUser() {
    this.postsToShow = this.postService
      .getMorePostsFromUserMobile(this.userService.userId, this.postId, this.userPostUserId);
  }

  incNumViews() {
    this.postService.incrementPostViews(this.userService.userId, this.postId);
  }

  didLike() {
    this.userService.didLike(this.postId).subscribe(res => {
      this.likeButtonClicked = res;
    })
  }

  toggleLikeButton() {
    if (this.registeredUser) {
      if (this.likeButtonClicked) {
        this.likeButtonClicked = false;
        this.numLikes -= 1;
        this.userService.unlike(this.postId);
      } else {
        this.likeButtonClicked = true;
        this.numLikes += 1;
        this.userService.like(this.postId);
      }
      //this.postService.incrementPostViews(this.userService.userId, this.postId);
    }
  }

  setImage(image) {
    var mainImageElement = $('#mainImage');
    mainImageElement.attr('src', image);
    var description = $('#description');
    description.text(this.postInfo.description);
    var link = $('#link');
    link.attr('href', this.postInfo.website);
    var price = $('span.price');
    price.text(this.postInfo.price);
  }

  setImageAndText(post) {
    this.openDialog(post);
  }

  openDialog(post): void {
    this.configService.setGeneralSession('product_id', post.postId);
    this.thumbnails = [];
    this.showSpinner = true;
    this.ngOnInit();
  }

  closeModal() {
    this.dialogRef.close();
  }

  hidePost(postId: number) {
    this.userService.hidePost(postId);
  }

  removePost(postId: number) {
    this.userService.removePost(postId);
  }

  OnDestroy(): void {
    this.onDestroy.next();
  }
}


