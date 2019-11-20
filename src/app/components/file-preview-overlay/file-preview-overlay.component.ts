import { Component, OnInit, Input } from '@angular/core';
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
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalVariable } from '../../../global';
import { ProductPageComponent } from '../product-page/product-page.component';
import { OverlayRef } from '@angular/cdk/overlay';
import { FilePreviewOverlayRef } from '../file-preview-overlay/file-preview-overlay-ref';
import { MorePosts } from '../../models/MorePosts';

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
  height: string = '600px';

  onDestroy: Subject<void> = new Subject<void>();
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  constructor(
    private feedService: FeedService,
    private userService: UserService,
    private postService: PostService,
    private dialogRef: FilePreviewOverlayRef
  ) { }

  ngOnInit() {
    this.getPostInfo();
    this.getMoreFromUser();
    this.incNumViews();
    //this.postImageAddr = this.postInfo.postImageAddr;
    this.userProfileSrc = '../../../assets/placeholder.png';

  }

  getPostInfo() {
    this.postService
      .getPostInfo()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(postInfo => {
        this.postInfo = postInfo;
        this.postImageAddr = this.postInfo.postImageAddr;
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
        this.feedService.sendMessage('done-loading');
      });

  }

  getMoreFromUser() {
    this.postsToShow = this.postService
      .getMorePostsFromUser();
  }

  incNumViews() {
    this.postService.incrementPostViews(this.userService.userId, this.postService.userPostPostId);
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
    this.postService.userPostPostId = post.postId;
    this.thumbnails = [];
    this.showSpinner = true;
    this.ngOnInit();
  }

  closeModal() {
    this.dialogRef.close();
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }
}


