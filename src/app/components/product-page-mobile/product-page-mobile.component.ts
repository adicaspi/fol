import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserPost } from '../../models/UserPost';
import { DialogService } from '../../services/dialog.service';
import { LocationService } from '../../services/location.service';
import { UserService } from '../../services/user.service';
import { Subject, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { User } from '../../models/User';
import { PostService } from '../../services/post.service';
import { PostInfo } from '../../models/PostInfo';
import { Router, ActivatedRoute } from '@angular/router';
import { ThousandSuffixesPipe } from './pipe-transform';
import { ConfigService } from '../../services/config.service';
import { MorePosts } from '../../models/MorePosts';


@Component({
  selector: 'app-product-page-mobile',
  templateUrl: './product-page-mobile.component.html',
  styleUrls: ['./product-page-mobile.component.css']
})
export class ProductPageMobileComponent implements OnInit, OnDestroy {
  userPost: UserPost;
  user: User;
  postId: number;
  userPostUserId: number;
  numFollowers$: Observable<number>;
  numViews: number;
  directingPage: string;
  userProfileSrc: any;
  storeLogoSrc: string;
  postInfo: PostInfo;
  postImageAddr: string;
  imageUrls: string[] = [];
  onDestroy: Subject<void> = new Subject<void>();
  postsToShow$: Observable<MorePosts[]>;
  pipeTransform: ThousandSuffixesPipe = new ThousandSuffixesPipe();

  private baseApiUrl = environment.BASE_API_URL;

  constructor(
    private dialogService: DialogService,
    private userService: UserService,
    private postService: PostService,
    private router: Router,
    private configService: ConfigService,
    private location: LocationService,
    private route: ActivatedRoute
  ) {
    this.userPostUserId = this.configService.getGeneralSession('user_id_post_id');
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(takeUntil(this.onDestroy))
      .subscribe((params) => {
        this.postId = +params.get('id');
        if (!(this.postId > 0)) {
          return;
        }
        this.imageUrls = [];
        this.getPostInfo();
        this.getMoreFromUser();
      });

    this.numFollowers$ = this.userService.getNumberOfFollowers(this.userPostUserId).pipe(map(res => this.pipeTransform.transform(res)));
    this.directingPage = this.dialogService.directingPage;
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  getPostInfo() {
    this.postService
      .getMobilePostInfo(this.postId, this.userPostUserId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(postInfo => {
        this.postInfo = postInfo;
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
      });
  }


  getMoreFromUser() {
    this.postsToShow$ = this.postService.getMorePostsFromUserMobile(this.postId, this.userPostUserId);
  }

  openMorePosts(post) {
    this.configService.setGeneralSession('product_id', post.postId);
    this.router.navigate(['/product-page', post.postId]);
  }


  goBackPage() {
    this.location.goBack();
  }

  profilePage() {
    this.router.navigate(['profile', this.postInfo.userId]);
  }
}
