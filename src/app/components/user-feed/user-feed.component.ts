import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute, Router, Routes, ParamMap } from '@angular/router';
import { Subject, Observer, Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PostService } from '../../services/post.service';
import { DialogService } from '../../services/dialog.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ConfigService } from '../../services/config.service';
import { ScrollHelperService } from '../../services/scroll-helper.service';
import { ProductPageMobileComponent } from '../product-page-mobile/product-page-mobile.component';
import { ErrorsService } from '../../services/errors.service';
import { FeedReturnObject } from '../../models/FeedReturnObject';
import { FilteringDTO } from '../../models/FilteringDTO';
import { MessageService } from '../../services/message.service';
import { NgxSpinnerService } from '../../../../node_modules/ngx-spinner';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.component.html',
  styleUrls: ['./user-feed.component.css']
})
export class UserFeedComponent implements OnInit {
  posts = [];
  offset: number = 0;
  desktop: boolean = true;
  searchedTouched: boolean = false;
  id = 0;
  prevId = 0;
  deviceInfo = null;
  loading: boolean = true;
  endOfFeed: boolean = false;
  showNoPostsMessage: boolean = false;
  userProfile: boolean = false;
  private baseApiUrl = environment.BASE_API_URL;
  private WindowSizeSubscription: Subscription
  private feedSubsription: Subscription
  private updateFeed: Subscription
  private anyErrors: boolean;
  private finished: boolean;
  routes: Routes = [
    { path: 'product-page', component: ProductPageMobileComponent }
  ];

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
    private errorsService: ErrorsService,
    private scrollHelperService: ScrollHelperService,
    private massageService: MessageService,
    private spinner: NgxSpinnerService,
    private userService: UserService

  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.WindowSizeSubscription = this.configService.windowSizeChanged.subscribe(
      value => {
        if (value.width <= 900) {
          this.desktop = true;
        }
        if (value.width <= 600) {
          this.desktop = false;
        }
      });
  }

  ngOnInit() {
    this.spinner.show();
    this.feedService.feedFilteringDTO = new FilteringDTO();
    this.updateFeed = this.feedService
      .getNewPosts().pipe(takeUntil(this.onDestroy)).subscribe(observablePosts => {
        observablePosts.pipe(takeUntil(this.onDestroy)).subscribe((observablePosts: FeedReturnObject) => {
          if (!observablePosts.newPosts) {
            this.endOfFeed = true;
            if (this.posts.length == 0) {
              this.showNoPostsMessage = true;
            }
          }
          else {
            this.showNoPostsMessage = false;
            if (this.offset != observablePosts.offset) {
              this.posts = this.posts.concat(observablePosts.newPosts);
              this.offset = observablePosts.offset;
              this.scrollHelperService.runDataLoaded();
            }
            else {
              this.endOfFeed = true;
            }
          }
          this.spinner.hide();
        })
      });
    this.getActivatedRoute();
    this.feedSubsription = this.massageService.getMessage().subscribe(msg => {
      if (msg) {
        if (msg.msg == 'update-feed') {
          this.spinner.show();
          this.posts = [];
          this.offset = 0;
          this.getActivatedRoute();
        }
        if (msg.msg == 'no posts') {
          this.showNoPostsMessage = true;
        }
      }
    });
  }

  getActivatedRoute() {
    this.activatedRoute.params
      .pipe(takeUntil(this.onDestroy))
      .subscribe(params => {
        this.id = +params['id'];
        if (this.userService.userId == this.id) {
          this.userProfile = true;
        }
        this.feedService.updateUserFeed(this.id, this.offset);
      });
  }


  onScroll() {
    if (!this.endOfFeed) {
      this.feedService.updateUserFeed(this.id, this.offset);
      this.spinner.show();

    } else {
      this.spinner.hide();
    }
  }

  openDialog(post): void {
    this.configService.setGeneralSession('product_id', post.post.postId);
    this.configService.setGeneralSession('user_id_post_id', post.post.userId);
    this.postService.userPost = post;
    if (this.desktop) {
      this.dialogService.openDialog();
    } else {
      this.router.navigate(['product-page', post.post.postId]);
    }
  }
  public ngOnDestroy(): void {
    this.WindowSizeSubscription.unsubscribe();
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
