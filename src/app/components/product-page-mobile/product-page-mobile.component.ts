import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserPost } from '../../models/UserPost';
import { DialogService } from '../../services/dialog.service';
import { UserService } from '../../services/user.service';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../models/User';
import { PostService } from '../../services/post.service';
import { PostInfo } from '../../models/PostInfo';
import { Router, ActivatedRoute } from '@angular/router';
import { ThousandSuffixesPipe } from './pipe-transform';
import * as $ from 'jquery';
import { ConfigService } from '../../services/config.service';
import { MorePosts } from '../../models/MorePosts';


@Component({
  selector: 'app-product-page-mobile',
  templateUrl: './product-page-mobile.component.html',
  styleUrls: ['./product-page-mobile.component.css']
})
export class ProductPageMobileComponent implements OnInit {
  userPost: UserPost;
  user: User;
  postId: number;
  userPostUserId: number;
  numFollowers: number;
  numViews: number;
  directingPage: string;
  userProfileSrc: any;
  storeLogoSrc: string;
  postInfo: PostInfo;
  postImageAddr: string;
  imageUrls: string[] = [];
  onDestroy: Subject<void> = new Subject<void>();
  postsToShow: Observable<MorePosts[]>;
  pipeTransform: ThousandSuffixesPipe = new ThousandSuffixesPipe();
  userProfile: boolean = false;

  private baseApiUrl = environment.BASE_API_URL;
  constructor(
    private dialogService: DialogService,
    private userService: UserService,
    private postService: PostService,
    private router: Router,
    private configService: ConfigService
  ) {
    this.postId = this.configService.getGeneralSession('product_id');
    this.userPostUserId = this.configService.getGeneralSession('user_id_post_id');
  }

  ngOnInit() {
    this.userService.getNumberOfFollowers(this.userPostUserId).subscribe(res => {
      this.numFollowers = this.pipeTransform.transform(res);
    })
    this.directingPage = this.dialogService.directingPage;
    this.getPostInfo();
    this.getMoreFromUser();
  }

  getPostInfo() {
    this.postService
      .getMobilePostInfo(this.postId, this.userPostUserId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(postInfo => {
        this.postInfo = postInfo;
        if (this.postInfo.userId == this.userService.userId) {
          this.userProfile = true;
        }
        this.numViews = this.pipeTransform.transform(postInfo.numViews);
        this.imageUrls.push(
          this.baseApiUrl + '/image?s3key=' + this.postInfo.postImageAddr
        );
        this.imageUrls.push(
          this.baseApiUrl + '/image?s3key=' + this.postInfo.thumbnailAddr
        );
        this.userProfileSrc = this.baseApiUrl + '/image?s3key=' + this.postInfo.userProfileImageAddr;
        this.storeLogoSrc = this.baseApiUrl + '/image?s3key=' + this.postInfo.storeLogoAddr;
        this.postImageAddr = this.baseApiUrl + '/image?s3key=' + this.postInfo.postImageAddr;
      })
  }


  getMoreFromUser() {
    this.postsToShow = this.postService
      .getMorePostsFromUserMobile(this.postId, this.userPostUserId);
  }

  openMorePosts(post) {
    this.configService.setGeneralSession('product_id', post.postId);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['product-page', post.postId]);
    });
  }


  goBackPage() {
    window.history.back();
  }

  profilePage() {
    this.router.navigate(['profile', this.postInfo.userId]);
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
