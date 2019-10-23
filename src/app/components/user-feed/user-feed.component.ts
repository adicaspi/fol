import { Component, OnInit, Input } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Observer, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxMasonryOptions } from 'ngx-masonry';
import { PostService } from '../../services/post.service';
import { DialogService } from '../../services/dialog.service';
import { ProductPageComponent } from '../product-page/product-page.component';
import { GlobalVariable } from '../../../global';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.component.html',
  styleUrls: ['./user-feed.component.css']
})
export class UserFeedComponent implements OnInit {
  posts: Array<any> = [];
  postsToShow = [];
  offset: number = 0;
  id = 0;
  deviceInfo = null;
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  private subscription;
  private anyErrors: boolean;
  private finished: boolean;


  public masonryOptions: NgxMasonryOptions = {
    transitionDuration: '0',
    horizontalOrder: true,
    gutter: 39
  };

  onDestroy: Subject<void> = new Subject<void>();

  constructor(
    private feedService: FeedService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private deviceService: DeviceDetectorService,
    private router: Router,
    private configService: ConfigService,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntil(this.onDestroy))
      .subscribe(params => {
        this.id = +params['id']; // CHNAGE TAKE USER ID FROM USER SERVICE
        this.generateUserFeed(0, this.id);
      });
    this.subscription = this.configService.windowSizeChanged.subscribe(
      value => {
        if (value.width <= 900) {
          console.log(this.masonryOptions.gutter)
          this.masonryOptions.gutter = 20;
        }
        if (value.width <= 600) {
          this.masonryOptions.gutter = 15;
          console.log(this.masonryOptions.gutter);
        }
      }),
      error => this.anyErrors = true,
      () => this.finished = true

  }

  private processData = posts => {
    this.posts = this.posts.concat(posts);
    posts.forEach(post => {
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
    this.generateUserFeed(this.offset, this.id);
  }

  openDialog(post): void {
    if (this.deviceService.isDesktop()) {
      //this.dialogService.openModalWindow(ProductPageComponent, post);
      this.postService.userPost = post;
      this.dialogService.openDialog();
    } else {
      this.dialogService.userPost = post;
      this.dialogService.directingPage = 'profile';
      this.router.navigate(['product-page']);
    }
  }
  public ngOnDestroy(): void {
    this.onDestroy.next();
  }
}
