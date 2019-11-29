import { Component, OnInit, Input } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { Subject, Observer, Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PostService } from '../../services/post.service';
import { DialogService } from '../../services/dialog.service';
import { GlobalVariable } from '../../../global';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ConfigService } from '../../services/config.service';
import { ProductPageMobileComponent } from '../product-page-mobile/product-page-mobile.component';
import { ErrorsService } from '../../services/errors.service';
import { FeedReturnObject } from '../../models/FeedReturnObject';
import { FilteringDTO } from '../../models/FilteringDTO';


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
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  private subscription;
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
    private errorsService: ErrorsService

  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.feedService.userfeedFilteringDTO = new FilteringDTO();

    this.activatedRoute.params
      .subscribe(params => {
        this.id = +params['id'];
      });

    this.updateFeed = this.feedService
      .getNewPosts().subscribe(observablePosts => {
        observablePosts.subscribe((observablePosts: FeedReturnObject) => {
          this.posts = this.posts.concat(observablePosts.newPosts);
          this.offset = observablePosts.offset;
        })
      });
    this.feedService.updateUserFeed(this.id, this.offset);


    //this.prevId = this.currId; //Updateing prevID in the first instantiating of the component
    this.subscription = this.configService.windowSizeChanged.pipe(takeUntil(this.onDestroy)).subscribe(
      value => {
        if (value.width <= 900) {
        }
        if (value.width <= 600) {
          this.desktop = false;

        }
      }),
      error => this.anyErrors = true,
      () => this.finished = true
    this.feedSubsription = this.errorsService.getMessage().subscribe(msg => {
      if (msg.error == 'update-userfeed') {
        this.posts = [];
        this.offset = 0;
        this.feedService.updateUserFeed(this.id, this.offset);
      }
    });

  }


  onScroll() {
    this.feedService.updateUserFeed(this.id, this.offset);
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
