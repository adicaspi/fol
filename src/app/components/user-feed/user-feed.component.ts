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
import { ProductPageMobileComponent } from '../product-page-mobile/product-page-mobile.component';
import { ErrorsService } from '../../services/errors.service';
import { FeedReturnObject } from '../../models/FeedReturnObject';
import { FilteringDTO } from '../../models/FilteringDTO';
import { MessageService } from '../../services/message.service';


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
    private massageService: MessageService

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
    console.log("in user-feed");
    //this.feedService.userfeedFilteringDTO = new FilteringDTO();
    this.feedService.feedFilteringDTO = new FilteringDTO();



    this.updateFeed = this.feedService
      .getNewPosts().pipe(takeUntil(this.onDestroy)).subscribe(observablePosts => {
        observablePosts.pipe(takeUntil(this.onDestroy)).subscribe((observablePosts: FeedReturnObject) => {
          if (this.offset != observablePosts.offset) {
            this.posts = this.posts.concat(observablePosts.newPosts);
            this.offset = observablePosts.offset;
            this.loading = false;
          }
          this.endOfFeed = true;
        })
      });
    this.getActivatedRoute();

    // this.feedService.updateUserFeed(this.id, this.offset);



    this.feedSubsription = this.massageService.getMessage().subscribe(msg => {

      if (msg) {
        console.log("im msg", msg);
        if (msg.msg == 'update-feed') {
          this.posts = [];
          this.offset = 0;

          this.getActivatedRoute();
        }
      }
    });

  }

  getActivatedRoute() {
    // this.activatedRoute.params
    //   .subscribe(params => {
    //     this.id = +params['id'];
    //     console.log("im id", params);
    //     this.feedService.updateUserFeed(this.id, this.offset);
    //   });
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap) => {
        console.log("im parms", params);
      }
    )
  }


  onScroll() {
    if (!this.endOfFeed) {
      this.feedService.updateUserFeed(this.id, this.offset);
      this.loading = true;
    } else {
      this.loading = false;
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
    this.feedSubsription.unsubscribe();
  }
}
