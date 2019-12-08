import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable, Subscription } from 'rxjs';
import { PostService } from '../../services/post.service';
import { DialogService } from '../../services/dialog.service';
import { ConfigService } from '../../services/config.service';
import { GlobalVariable } from '../../../global';
import { Router } from '@angular/router';
import { ErrorsService } from '../../services/errors.service';
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { BehaviorSubject } from 'rxjs';
import { FeedReturnObject } from '../../models/FeedReturnObject';
import { FilteringDTO } from '../../models/FilteringDTO';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-timeline-feed',
  templateUrl: './timeline-feed.component.html',
  styleUrls: ['./timeline-feed.component.css'],

})
export class TimelineFeedComponent implements OnInit {
  id: number;
  posts = [];
  offset: number = 0;
  desktop: boolean = true;
  onDestroy: Subject<void> = new Subject<void>();
  error: string;
  endOfFeed = false;
  feedMessage: string;
  feedSubscription: Subscription;
  updateFeed: Subscription
  newoffset = new BehaviorSubject(null);
  infinite: Observable<any[]>;


  private baseApiUrl = GlobalVariable.BASE_API_URL;
  private WindowSizeSubscription: Subscription;
  private anyErrors: boolean;
  private finished: boolean;

  constructor(
    private userService: UserService,
    private feedService: FeedService,
    private postService: PostService,
    private dialogService: DialogService,
    private configService: ConfigService,
    private router: Router,
    private errorsService: ErrorsService,
  ) {
    this.id = this.userService.getCurrentUser();
    this.feedSubscription = this.errorsService.getMessage().pipe(takeUntil(this.onDestroy)).subscribe(msg => {
      if (msg.error == 'update-timelinefeed') {
        console.log("in msg im timeline-feed");
        this.posts = [];
        this.offset = 0;
        this.feedService.updateTimelineFeed(this.id, this.offset);
      }
    });
  }

  ngOnInit() {
    this.feedService.timelinefeedFilteringDTO = new FilteringDTO();
    this.updateFeed = this.feedService
      .getNewPosts().pipe(takeUntil(this.onDestroy)).subscribe(observablePosts => {
        observablePosts.pipe(takeUntil(this.onDestroy)).subscribe((observablePosts: FeedReturnObject) => {
          if (this.offset != observablePosts.offset) {
            this.posts = this.posts.concat(observablePosts.newPosts);
            this.offset = observablePosts.offset;
          }
        })
      });
    this.feedService.updateTimelineFeed(this.id, this.offset);
    this.WindowSizeSubscription = this.configService.windowSizeChanged
      .subscribe(
        value => {
          if (value.width >= 600) {
            this.desktop = true;
          }

          if (value.width <= 600) {
            this.desktop = false;
          }
        });
  }

  onScroll() {
    this.feedService.updateTimelineFeed(this.id, this.offset);
  }

  openDialog(post): void {
    this.postService.userPostUserId = post.post.userId;
    this.postService.userPostPostId = post.post.postId;
    if (this.desktop) {
      this.dialogService.openDialog();
    } else {
      //this.dialogService.userPost = post;
      this.dialogService.directingPage = 'feed';
      this.router.navigate(['product-page']);
    }
  }

  profilePage(post) {
    this.router.navigate(['profile', post['post']['userId']]);
  }

  public ngOnDestroy(): void {
    this.WindowSizeSubscription.unsubscribe();
    this.feedSubscription.unsubscribe();
    this.onDestroy.next();
  }


}
