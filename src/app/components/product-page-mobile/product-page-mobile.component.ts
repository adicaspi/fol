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
import { Meta, Title } from '../../../../node_modules/@angular/platform-browser';
import * as jquery from 'jquery';


@Component({
  selector: 'app-product-page-mobile',
  templateUrl: './product-page-mobile.component.html',
  styleUrls: ['./product-page-mobile.component.scss']
})
export class ProductPageMobileComponent implements OnInit, OnDestroy {
  userPost: UserPost;
  user: User;
  postId: number;
  masterUserId: number;
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
  createDate: Date;
  hoursDiffrence = 0;
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
    private dialog: MatDialog,
    private titleService: Title,
    private meta: Meta
  ) {


  }

  ngOnInit() {
    this.masterUserId = this.configService.getGeneralSession('user_id_post_id');
    this.postId = this.configService.getGeneralSession('product_id');
    this.configService.removeItem('product_id');
    this.titleService.setTitle('Product Page');
    this.meta.addTag({ name: 'robots', content: 'noimageindex, noarchive' });
    if (this.userService.userId) {
      this.registeredUser = true;
      this.userID = this.userService.userId;
    } else {
      this.userID = 7;
    }
    this.ios = this.configService.iOS();
    if (!this.postId) {
      this.route.paramMap
        .pipe(takeUntil(this.onDestroy))
        .subscribe((params) => {
          this.postId = +params.get('id');
          if (!(this.postId > 0)) {
            return;
          }
          else {
            this.imageUrls = [];
            this.getPostInfo(this.userID, this.postId);
          }
        });
    } else {
      this.imageUrls = [];
      this.getPostInfo(this.userID, this.postId);
    }
    this.directingPage = this.dialogService.directingPage;
    if (this.registeredUser) {
      this.didLike();
      this.didSave();
      this.getMoreFromUser(this.userID, this.masterUserId);
    }
    this.incNumViews();

  }

  getPostInfo(userID: number, postID: number) {
    this.postService
      .getMobilePostInfo(userID, postID)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(postInfo => {
        this.postInfo = postInfo;
        this.masterUserId = postInfo.userId;
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

        this.numFollowers$ = this.userService.getNumberOfFollowers(this.masterUserId).pipe(map(res => this.pipeTransform.transform(res)));

        this.userProfileSrc = this.postInfo.userProfileImageAddr;
        this.storeLogoSrc = this.postInfo.storeLogoAddr;
        this.postImageAddr = this.postInfo.postImageAddr;
        this.numViews = this.postInfo.numViews;
        // this.getHoursDifference();

      });
  }

  getHoursDifference() {
    var currentDateStringFormat = new Date();
    var createDate = new Date(this.postInfo.createDate);
    var hoursFullDiffrence = Math.abs(currentDateStringFormat.getTime() - createDate.getTime()) / 36e5;
    this.hoursDiffrence = Math.abs(Math.round(hoursFullDiffrence));
  }

  getDateStringFormat(date: any) {
    var today = date;
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    let currentDate = (mm + '/' + dd + '/' + yyyy);
    return currentDate;

  }

  postSalePrice(post) {
    return post.salePrice;
  }



  getMoreFromUser(userID, masterUserID) {
    this.postsToShow$ = this.postService.getMorePostsFromUserMobile(userID, this.postId, masterUserID);
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
    this.configService.setGeneralSession('product_id', this.postId);
    const config = {
      width: "100vh",
      height: 'unset',
      data: {
        close: true
      }
    }
    const dialogRef = this.dialog.open(LoginComponent, config);
    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy)).subscribe(result => {
      let id = this.configService.getGeneralSession('user_id');
      if (id) {
        this.registeredUser = true;
        jquery("a.login").css("display", "none");
      }
    })
    dialogRef.disableClose = false;
  }

  hidePost(postId: number) {
    this.userService.hidePost(postId);
  }

  incNumViews() {
    this.postService.incrementPostViews(this.userID, this.postId);
  }

  incPostRedirects() {
    this.postService.incrementPostRedirects(this.userID, this.postId);
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
    this.configService.removeItem('user_id_post_id');
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
