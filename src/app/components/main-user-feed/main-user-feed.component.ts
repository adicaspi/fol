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
import * as jquery from 'jquery';
import * as $ from 'jquery';
import { User } from '../../models/User';




@Component({
  selector: 'app-main-user-feed',
  templateUrl: './main-user-feed.component.html',
  styleUrls: ['./main-user-feed.component.scss']
})
export class MainUserFeedComponent implements OnInit {

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
  scrollPageToTop: boolean = false;
  user: Observable<User>;
  private baseApiUrl = environment.BASE_API_URL;
  private WindowSizeSubscription: Subscription
  private feedSubscription: Subscription
  private updateFeed: Subscription
  private anyErrors: boolean;
  private finished: boolean;
  savedTab: boolean = false;
  userFeedTab: boolean = true;
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
    this.id = this.userService.userId;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  ngOnInit() {
    this.spinner.show();
    jquery(".scroll-bar-container").css("margin", "-6px 0px -6px");
    this.feedService.feedFilteringDTO = new FilteringDTO();
    this.updateFeed = this.feedService
      .getNewPosts().pipe(takeUntil(this.onDestroy)).subscribe(observablePosts => {
        observablePosts.pipe(takeUntil(this.onDestroy)).subscribe((observablePosts: any) => {
          if (observablePosts == "endOfFeed") {
            this.endOfFeed = true;
            if (this.posts.length == 0) {
              this.showNoPostsMessage = true;
            }
          }
          else {

            this.showNoPostsMessage = false;
            this.posts = this.posts.concat(observablePosts.newPosts);
            this.offset = observablePosts.offset;
            if (!this.scrollPageToTop) {
              this.scrollHelperService.runDataLoaded();
            }
          }
          this.spinner.hide();
        })
      });
    this.feedSubscription = this.massageService.getMessage().pipe(takeUntil(this.onDestroy)).subscribe(msg => {
      if (msg) {
        if (msg.msg == 'update-feed') {
          console.log("in main user feed feed msg");
          this.spinner.show();
          this.posts = [];
          this.offset = 0;
          this.scrollPageToTop = true;
          //this.getActivatedRoute();
          this.feedService.updateUserFeed(this.id, this.offset);
        }
      }
    });
    //this.getActivatedRoute();
    this.WindowSizeSubscription = this.configService.windowSizeChanged.subscribe(
      value => {
        if (value.width > 600) {
          this.desktop = true;
        }
        if (value.width <= 600) {
          this.desktop = false;
        }
      });
    this.getUserFeed();
  }

  postSalePrice(post) {
    return post.post.salePrice;
  }

  getSavedFeed() {
    this.savedTab = true;
    this.userFeedTab = false;
    this.posts = [];
    this.offset = 0;
    this.scrollPageToTop = true;
    this.feedService.updateSavedFeed(this.id, this.offset);
  }

  getUserFeed() {
    this.savedTab = false;
    this.userFeedTab = true;
    this.posts = [];
    this.offset = 0;
    this.scrollPageToTop = true;
    if (!this.desktop) {
      this.feedService.updateUserFeed(this.id, this.offset);
    }
  }

  onScroll() {
    if (this.userFeedTab) {
      if (!this.endOfFeed) {
        this.feedService.updateUserFeed(this.id, this.offset);
        this.spinner.show();

      } else {
        this.spinner.hide();
      }
    } else {
      if (!this.endOfFeed) {
        this.feedService.updateSavedFeed(this.id, this.offset);
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
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
    this.feedSubscription.unsubscribe();
    this.updateFeed.unsubscribe();
  }

}
