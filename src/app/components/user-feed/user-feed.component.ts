import { Component, OnInit, Input } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { Subject, Observer, Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxMasonryOptions } from 'ngx-masonry';
import { PostService } from '../../services/post.service';
import { DialogService } from '../../services/dialog.service';
import { ProductPageComponent } from '../product-page/product-page.component';
import { GlobalVariable } from '../../../global';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ConfigService } from '../../services/config.service';
import { ProductPageMobileComponent } from '../product-page-mobile/product-page-mobile.component';
import { ErrorsService } from '../../services/errors.service';


@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.component.html',
  styleUrls: ['./user-feed.component.css']
})
export class UserFeedComponent implements OnInit {
  posts: Array<any> = [];
  postsToShow = [];
  offset: number = 0;
  desktop: boolean = true;
  searchedTouched: boolean = false;
  currId = 0;
  prevId = 0;
  deviceInfo = null;
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  private subscription;
  private feedSubsription: Subscription
  private anyErrors: boolean;
  private finished: boolean;
  routes: Routes = [
    { path: 'product-page', component: ProductPageMobileComponent }
  ];

  public masonryOptions: NgxMasonryOptions = {
    transitionDuration: '0',
    horizontalOrder: true,
    fitWidth: true,
    gutter: 39
  };

  onDestroy: Subject<void> = new Subject<void>();
  error: string = "";

  constructor(
    private feedService: FeedService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private deviceService: DeviceDetectorService,
    private router: Router,
    private configService: ConfigService,
    private postService: PostService,
    private errorsService: ErrorsService

  ) { this.router.routeReuseStrategy.shouldReuseRoute = () => false; }

  ngOnInit() {

    this.activatedRoute.params
      .pipe(takeUntil(this.onDestroy))
      .subscribe(params => {
        this.currId = +params['id']; // CHNAGE TAKE USER ID FROM USER SERVICE
        this.generateUserFeed(this.offset, this.currId);
      });
    this.prevId = this.currId; //Updateing prevID in the first instantiating of the component
    this.subscription = this.configService.windowSizeChanged.pipe(takeUntil(this.onDestroy)).subscribe(
      value => {
        if (value.width <= 900) {
          // this.masonryOptions.gutter = 20;
        }
        if (value.width <= 600) {
          this.desktop = false;
          this.masonryOptions.gutter = 20;
        }
      }),
      error => this.anyErrors = true,
      () => this.finished = true
    this.feedSubsription = this.errorsService.getMessage().subscribe(msg => {
      if (msg.error == 'update-userfeed') {
        this.postsToShow = [];
        this.offset = 0;
        this.generateUserFeed(this.offset, this.currId);
      }
    });

  }

  private processData = posts => {


    this.posts = this.posts.concat(posts);
    if (this.offset == posts['newOffset']) {
      return;
    }
    this.offset = posts['newOffset'];
    posts['feedPosts'].forEach(post => {
      let baseAPI = this.baseApiUrl + '/image?s3key=';
      let postObject = {
        post: post,
        postImgSrc: baseAPI + post.postImageAddr
      };

      this.postsToShow.push(postObject);
    });
  };
  generateUserFeed(offset: number, userId: number) {
    this.feedService
      .getUserFeed(userId, offset)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(this.processData);
  }

  fetchImages() {
    console.log("in fetch", (this.offset));
    this.generateUserFeed(this.offset, this.currId);
  }

  openDialog(post): void {
    this.postService.userPostUserId = post.post.userId;
    this.postService.userPostPostId = post.post.postId;
    this.postService.userPost = post;
    if (this.desktop) {
      this.dialogService.openDialog();
    } else {
      //this.dialogService.userPost = post;
      this.dialogService.directingPage = 'profile';
      this.router.navigate(['product-page']);
    }
  }
  public ngOnDestroy(): void {
    this.onDestroy.next();
  }
}
