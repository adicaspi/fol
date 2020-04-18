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
import { ThousandSuffixesPipe } from '../../models/pipe-transform';
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
  numLikes: number;
  directingPage: string;
  userProfileSrc: any;
  storeLogoSrc: string;
  postInfo: PostInfo;
  postImageAddr: string;
  imageUrls: string[] = [];
  onDestroy: Subject<void> = new Subject<void>();
  postsToShow$: Observable<MorePosts[]>;
  pipeTransform: ThousandSuffixesPipe = new ThousandSuffixesPipe();
  userProfile: boolean = false;
  likeButtonClicked: boolean = false;
  registeredUser: boolean = false;
  showRegsterMsg: boolean = false;
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
    if (this.userService.userId) {
      this.registeredUser = true;
    }
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
    if (this.registeredUser) {
      this.didLike();
    }

    this.incNumViews();
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
        this.numLikes = this.pipeTransform.transform(postInfo.numLikes);
        this.imageUrls.push(
          this.baseApiUrl + '/image?s3key=' + this.postInfo.postImageAddr
        );
        if (this.postInfo.thumbnailAddr) {
          this.imageUrls.push(
            this.baseApiUrl + '/image?s3key=' + this.postInfo.thumbnailAddr
          );
        }
        this.userProfileSrc = this.baseApiUrl + '/image?s3key=' + this.postInfo.userProfileImageAddr;
        this.storeLogoSrc = this.baseApiUrl + '/image?s3key=' + this.postInfo.storeLogoAddr;
        this.postImageAddr = this.baseApiUrl + '/image?s3key=' + this.postInfo.postImageAddr;
      });
  }


  getMoreFromUser() {
    this.postsToShow$ = this.postService.getMorePostsFromUserMobile(this.userService.userId, this.postId, this.userPostUserId);
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

  hidePost(postId: number) {
    this.userService.hidePost(postId);
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
    } else {
      this.showRegsterMsg = true;
    }
  }

  removePost(postId: number) {
    this.userService.removePost(postId);
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
