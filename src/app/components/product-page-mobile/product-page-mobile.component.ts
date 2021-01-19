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
import { FeedService } from '../../services/feed.service';
import { MatDialog } from '../../../../node_modules/@angular/material';
import { LoginComponent } from '../login/login.component';


@Component({
  selector: 'app-product-page-mobile',
  templateUrl: './product-page-mobile.component.html',
  styleUrls: ['./product-page-mobile.component.scss']
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
  likeList = [];
  imageUrls: string[] = [];
  ios: boolean = false;
  onDestroy: Subject<void> = new Subject<void>();
  postsToShow$: Observable<MorePosts[]>;
  pipeTransform: ThousandSuffixesPipe = new ThousandSuffixesPipe();
  userProfile: boolean = false;
  likeButtonClicked: boolean = false;
  saveButtonClicked: boolean = false;
  registeredUser: boolean = false;
  showRegsterMsg: boolean = false;
  userID: number;
  private baseApiUrl = environment.BASE_API_URL;

  constructor(
    private dialogService: DialogService,
    private userService: UserService,
    private postService: PostService,
    private router: Router,
    private configService: ConfigService,
    private location: LocationService,
    private route: ActivatedRoute,
    private feedService: FeedService,
    private dialog: MatDialog
  ) {
    this.userPostUserId = this.configService.getGeneralSession('user_id_post_id');

  }

  ngOnInit() {
    if (this.userService.userId) {
      this.registeredUser = true;
      this.userID = this.userService.userId;
    } else {
      var refferingUrl = document.referrer;
      if (refferingUrl.includes('explore')) {
        this.userID = 7;
      }
      this.ios = this.configService.iOS();
    }
    this.route.paramMap
      .pipe(takeUntil(this.onDestroy))
      .subscribe((params) => {
        this.postId = +params.get('id');
        if (!(this.postId > 0)) {
          return;
        }
        this.imageUrls = [];
        this.getPostInfo(this.userID);
        if (this.registeredUser) {
          this.getMoreFromUser();
        }
      });
    this.numFollowers$ = this.userService.getNumberOfFollowers(this.userPostUserId).pipe(map(res => this.pipeTransform.transform(res)));
    this.directingPage = this.dialogService.directingPage;
    if (this.registeredUser) {
      this.didLike();
      this.didSave();
      //this.incNumViews();
    }
  }

  getPostInfo(userID: number) {
    this.postService
      .getMobilePostInfo(userID, this.postId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(postInfo => {
        this.postInfo = postInfo;
        if (this.postInfo.userId == this.userService.userId) {
          this.userProfile = true;
        }
        this.numLikes = this.pipeTransform.transform(postInfo.numLikes);
        this.imageUrls.push(
          this.postInfo.postImageAddr
        );
        if (this.postInfo.thumbnailAddr) {
          this.imageUrls.push(
            this.postInfo.thumbnailAddr
          );
        } if (this.postInfo.selfThumbAddr) {
          this.imageUrls.push(
            this.postInfo.selfThumbAddr
          );
        }

        this.userProfileSrc = this.postInfo.userProfileImageAddr;
        this.storeLogoSrc = this.postInfo.storeLogoAddr;
        this.postImageAddr = this.postInfo.postImageAddr;
      });
  }

  postSalePrice(post) {
    return post.salePrice;
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
    //  if (this.registeredUser) {
    this.router.navigate(['profile', this.postInfo.userId]);
    // } else {
    //   this.registerPage();
    // }
  }

  registerPage(): void {
    //this.router.navigate(['/login']);
    const config = {
      width: "100vh",
      height: '580px',
      data: {
        close: true
      }
    }
    const dialogRef = this.dialog.open(LoginComponent, config);
    dialogRef.disableClose = true;
  }

  hidePost(postId: number) {
    this.userService.hidePost(postId);
  }

  incNumViews() {
    this.postService.incrementPostViews(this.userID, this.postId);
  }

  async didLike() {
    await this.userService.didLike(this.postId).subscribe(res => {
      this.likeButtonClicked = res;
    })
    await this.getLikeList(this.postId);
  }

  async getLikeList(postId) {
    this.feedService.likeList(postId).pipe(takeUntil(this.onDestroy))
      .subscribe(res => {
        if (this.likeButtonClicked) {
          res.forEach(like => {
            if (like.username != this.postInfo.userName) {
              this.likeList.push(like);
            }
          })
        } else {
          this.likeList = res
        }
      });
  }

  didSave() {
    this.userService.didSave(this.postId).subscribe(res => {
      this.saveButtonClicked = res;
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

  toggleSaveButton() {
    if (this.registeredUser) {
      if (this.saveButtonClicked) {
        this.saveButtonClicked = false;
        this.userService.unsave(this.postId);
      } else {
        this.saveButtonClicked = true;
        this.userService.save(this.postId);
      }
    }
  }

  goToLikeList() {
    this.configService.setGeneralSession('postId', this.postId);
    this.configService.setGeneralSession('list', 1);
    this.configService.setGeneralSession('desktop', 1);
    this.router.navigate(['follow-list', this.postInfo.userId]);
  }

  removePost(postId: number) {
    this.userService.removePost(postId);
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
