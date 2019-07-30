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
  website_logo: string;
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
    this.dialogRef.updateSize('750px');
    console.log('im diabsle close', this.dialogRef.disableClose);
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
        this.setWebsiteLogo(postInfo.website);
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
          console.log('inside foreach res', result[index]);
          let baseAPI = this.baseApiUrl + '/image?s3key=';
          let postObject = {
            post: result[index],
            imgSrc: baseAPI + result[index].postImageAddr
          };
          this.postsToShow.push(postObject);
        });
      });
  }

  setImage(image) {
    var mainImageElement = $('#mainImage');
    mainImageElement.attr('src', image);
    var description = $('#description');
    description.text(this.userPost['post']['description']);
    var link = $('#link');
    link.attr('href', this.userPost['post']['link']);
    this.setWebsiteLogo(this.userPost['post']['website']);
    var price = $('span.price');
    price.text(this.userPost['post']['price']);
  }

  setImageAndText(post) {
    var mainImageElement = $('#mainImage');
    mainImageElement.attr('src', post['imgSrc']);
    var description = $('#description');
    description.text(post['post']['description']);
    var link = $('#link');
    link.attr('href', post['post']['link']);
    this.setWebsiteLogo(post['post']['website']);
    var price = $('span.price');
    price.text(post['post']['price']);
  }

  setWebsiteLogo(website) {
    console.log('inside set website logo', website);
    switch (website) {
      case 'www.terminalx.com':
        this.website_logo = '../../../assets/terminalx.PNG';
        this.postInfo.currency = 'ils';
        //this.rtl = true;
        break;
      case 'www.zara.com':
        this.website_logo = '../../../assets/zara.PNG';
        this.postInfo.currency = 'ils';
        //this.rtl = true;
        break;
      case 'www.adikastyle.com':
        this.website_logo = '../../../assets/adika.PNG';
        this.postInfo.currency = 'ils';
        //this.rtl = true;
        break;
      case 'www.asos.com':
        this.website_logo = '../../../assets/asos.PNG';
        this.postInfo.currency = 'usd';
        break;
      case 'www.farfetch.com':
        this.website_logo = '../../../assets/farfetch.PNG';
        this.postInfo.currency = 'usd';
        break;
      case 'www.shein.com':
        this.website_logo = '../../../assets/shein.PNG';
        this.postInfo.currency = 'usd';
        break;
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
  public ngOnDestroy(): void {
    this.onDestroy.next();
  }
}
