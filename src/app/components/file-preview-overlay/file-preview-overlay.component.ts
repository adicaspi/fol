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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalVariable } from '../../../global';
import { ProductPageComponent } from '../product-page/product-page.component';
import { OverlayRef } from '@angular/cdk/overlay';
import { FilePreviewOverlayRef } from '../file-preview-overlay/file-preview-overlay-ref';

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
  postsToShow = [];
  user: User;
  mainImageSrc: any;
  postImageAddr: any;
  userProfileSrc: any;
  thumbnails = [];

  onDestroy: Subject<void> = new Subject<void>();
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  constructor(
    private feedService: FeedService,
    private userService: UserService,
    private postService: PostService,
    private dialogRef: FilePreviewOverlayRef
  ) { }

  ngOnInit() {
    this.userPost = this.postService.userPost;
    this.postImageAddr = this.userPost.postImageAddr;

    this.userProfileSrc = '../../../assets/placeholder.png';

    this.userService
      .getUserDetails(this.userPost['post']['userId'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(user => {
        this.user = user;
        this.userProfileSrc =
          this.baseApiUrl + '/image?s3key=' + this.user.profileImageAddr;
        this.getMoreFromUser(this.userPost['post']['userId']);
      });
  }

  getPostInfo() {
    this.postService
      .getPostInfo(
        this.userPost['post']['userId'],
        this.userPost['post']['postId']
      )
      .pipe(takeUntil(this.onDestroy))
      .subscribe(postInfo => {
        console.log("im post info", postInfo);
        this.postInfo = postInfo;
        this.thumbnails.push(
          this.baseApiUrl + '/image?s3key=' + this.postInfo.thumbnailAddr
        );
        this.thumbnails.push(
          this.baseApiUrl + '/image?s3key=' + this.postInfo.postImageAddr
        );
        this.storeLogoSrc = this.baseApiUrl + '/image?s3key=' + this.postInfo.storeLogoAddr
        this.showSpinner = false;
        this.feedService.sendMessage('done-loading');
      });
  }

  getMoreFromUser(userId: number) {
    this.feedService
      .getUserFeed(userId, 0)
      .toPromise()
      .then(result => {
        let len = result.length;
        var i = Math.min(3, len);
        var arr = [];
        while (arr.length < i) {
          var r = Math.floor(Math.random() * len);
          if (arr.indexOf(r) === -1) arr.push(r);
        }
        arr.forEach(index => {
          let baseAPI = this.baseApiUrl + '/image?s3key=';
          let postObject = {
            post: result[index],
            postImgSrc: baseAPI + result[index].postImageAddr
          };
          this.postsToShow.push(postObject);
        });
        this.getPostInfo();
      });
  }

  setImage(image) {
    var mainImageElement = $('#mainImage');
    mainImageElement.attr('src', image);
    var description = $('#description');
    description.text(this.userPost['post']['description']);
    var link = $('#link');
    link.attr('href', this.userPost['post']['link']);
    var price = $('span.price');
    price.text(this.userPost['post']['price']);
  }

  setImageAndText(post) {
    this.openDialog(post);
  }

  openDialog(post): void {
    this.postService.userPost = post;
    this.postsToShow = [];
    this.thumbnails = [];
    this.showSpinner = true;
    this.ngOnInit();
  }

  // setWebsiteLogo(postInfo:PostInfo) {
  //   switch (postInfo.website) {
  //     case 'www.terminalx.com':
  //       this.website_logo = '../../../assets/terminalx.PNG';
  //       this.postInfo.currency = 'ils';

  //       break;
  //     case 'www.zara.com':
  //       this.website_logo = '../../../assets/zara.PNG';
  //       this.postInfo.currency = 'ils';

  //       break;
  //     case 'www.adikastyle.com':
  //       this.website_logo = '../../../assets/adika.PNG';
  //       this.postInfo.currency = 'ils';

  //       break;
  //     case 'www.asos.com':
  //       this.website_logo = '../../../assets/asos.PNG';
  //       this.postInfo.currency = 'usd';
  //       break;
  //     case 'www.farfetch.com':
  //       this.website_logo = '../../../assets/farfetch.PNG';
  //       this.postInfo.currency = 'usd';
  //       break;
  //     case 'www.shein.com':
  //       this.website_logo = '../../../assets/shein.PNG';
  //       this.postInfo.currency = 'usd';
  //       break;
  //   }
  // }

  closeModal() {
    this.dialogRef.close();
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }
}
