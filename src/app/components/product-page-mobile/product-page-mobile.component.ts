import { Component, OnInit } from '@angular/core';
import { UserPost } from '../../models/UserPost';
import { DialogService } from '../../services/dialog.service';
import { UserService } from '../../services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalVariable } from '../../../global';
import { User } from '../../models/User';
import { PostService } from '../../services/post.service';
import { PostInfo } from '../../models/PostInfo';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-product-page-mobile',
  templateUrl: './product-page-mobile.component.html',
  styleUrls: ['./product-page-mobile.component.css']
})
export class ProductPageMobileComponent implements OnInit {
  userPost: UserPost;
  user: User;
  directingPage: string;
  userProfileSrc: any;
  postInfo: PostInfo;
  thumbnails = [];
  onDestroy: Subject<void> = new Subject<void>();
  rtl: boolean = false;
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  constructor(
    private dialogService: DialogService,
    private userService: UserService,
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userPost = this.dialogService.userPost;
    this.directingPage = this.dialogService.directingPage;
    this.userService
      .getUserDetails(this.userPost['post']['userId'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(user => {
        this.user = user;
        this.userProfileSrc =
          this.baseApiUrl + '/image?s3key=' + this.user.profileImageAddr;
      });
    this.getPostInfo();
  }

  getPostInfo() {
    this.postService
      .getPostInfo(
        this.userPost['post']['userId'],
        this.userPost['post']['postId']
      )
      .pipe(takeUntil(this.onDestroy))
      .subscribe(postInfo => {
        this.postInfo = postInfo;

        switch (this.postInfo.website) {
          case 'www.terminalx.com':
            this.postInfo.website_logo = '../../../assets/terminalx.PNG';
            this.postInfo.currency = 'ils';
            this.rtl = true;
            break;
          case 'www.zara.com':
            this.postInfo.website_logo = '../../../assets/zara.PNG';
            this.postInfo.currency = 'ils';
            this.rtl = true;
            break;
          case 'www.adikastyle.com':
            this.postInfo.website_logo = '../../../assets/adika.PNG';
            this.postInfo.currency = 'ils';
            this.rtl = true;
            break;
          case 'www.asos.com':
            this.postInfo.website_logo = '../../../assets/asos.PNG';
            this.postInfo.currency = 'usd';
            break;
          case 'www.farfetch.com':
            this.postInfo.website_logo = '../../../assets/farfetch.PNG';
            this.postInfo.currency = 'usd';
            break;
          case 'www.shein.com':
            this.postInfo.website_logo = '../../../assets/shein.PNG';
            this.postInfo.currency = 'usd';
            break;
        }

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

  goBackPage() {
    if (this.directingPage == 'profile') {
      this.router.navigate(['profile', this.user.id]);
    }
    if (this.directingPage == 'feed') {
      this.router.navigate(['feed', this.user.id]);
    }
    if (this.directingPage == 'explore') {
      this.router.navigate(['explore', this.user.id]);
    }
  }
}
