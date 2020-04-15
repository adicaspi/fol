import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ScrollHelperService } from '../../services/scroll-helper.service';
import { UserService } from '../../services/user.service';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable, Subscription } from 'rxjs';
import { PostService } from '../../services/post.service';
import { DialogService } from '../../services/dialog.service';
import { ConfigService } from '../../services/config.service';
import { Router, ActivatedRoute } from '@angular/router';
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
import { MessageService } from '../../services/message.service';
import { NgxSpinnerService } from "ngx-spinner";
import * as jquery from 'jquery';

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
  loading: boolean = true;
  enfOfFeed: boolean = false;
  public following: number;
  showNoPostsMessage: boolean = false;
  showDiscover: boolean = false;
  scrollPageToTop: boolean = false;


  private baseApiUrl = environment.BASE_API_URL;
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
    private activatedRoute: ActivatedRoute,
    private errorsService: ErrorsService,
    private scrollHelperService: ScrollHelperService,
    private massageService: MessageService,
    private spinner: NgxSpinnerService
  ) {

  }

  ngOnInit() {
    console.log("in init");
    this.spinner.show();
    jquery(".wrapper.scroll-bar-container").css("position", "fixed");
    this.id = this.userService.getCurrentUser();
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
            this.scrollHelperService.runDataLoaded();
            if (this.scrollPageToTop = true) {
              window.scrollTo(0, 0);
            }

          }
          this.spinner.hide();
        }, error => {
          console.log(error);
        })
      },
        error => console.log(error)
      );
    this.feedSubscription = this.massageService.getMessage().pipe(takeUntil(this.onDestroy)).subscribe(msg => {
      if (msg) {
        if (msg.msg == 'update-feed') {
          this.showDiscover = false;
          this.spinner.show();
          this.posts = [];
          this.offset = 0;
          this.scrollPageToTop = true;
          this.feedService.updateTimelineFeed(this.id, this.offset);
        }
      }
    });
    this.userService.getNumberOfFollowing(this.id).subscribe(res => {
      this.following = res;
      if (!this.following) {
        this.router.navigate(['feed-discover-people']);
      }
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
    if (!this.endOfFeed) {
      this.feedService.updateTimelineFeed(this.id, this.offset);
      this.spinner.show();
    } else {
      this.spinner.hide();
    }
  }

  openDialog(post): void {
    this.configService.setGeneralSession('product_id', post.post.postId);
    this.configService.setGeneralSession('user_id_post_id', post.post.userId);
    if (this.desktop) {
      this.dialogService.openDialog();
    } else {
      this.router.navigate(['product-page', post.post.postId]);
    }
  }

  profilePage(post) {
    this.router.navigate(['profile', post['post']['userId']]);
  }

  discoverPeople() {
    this.router.navigate(['discover-people-user', this.id]);
  }

  public ngOnDestroy(): void {
    this.WindowSizeSubscription.unsubscribe();
    this.feedSubscription.unsubscribe();
    this.onDestroy.next();
    this.updateFeed.unsubscribe();
  }


}
