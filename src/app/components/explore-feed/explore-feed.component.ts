import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user.service';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import * as $ from 'jquery';

import { PostService } from '../../services/post.service';

import { NgxMasonryOptions } from 'ngx-masonry';
import { ErrorsService } from '../../services/errors.service';
import { FeedReturnObject } from '../../models/FeedReturnObject';
import { FilteringDTO } from '../../models/FilteringDTO';
import { ConfigService } from '../../services/config.service';
import { DialogService } from '../../services/dialog.service';
import { Router } from '../../../../node_modules/@angular/router';
import { MessageService } from '../../services/message.service';
import * as jquery from 'jquery';

@Component({
  selector: 'app-explore-feed',
  templateUrl: './explore-feed.component.html',
  styleUrls: ['./explore-feed.component.css']
})
export class ExploreFeedComponent implements OnInit {
  id: number;
  posts = [];
  offset: number = 0;
  endOfFeed: boolean = false;
  loading: boolean = true;
  onDestroy: Subject<void> = new Subject<void>();
  desktop: boolean;
  private feedSubsription: Subscription
  private baseApiUrl = environment.BASE_API_URL;
  private updateFeed: Subscription

  count = 0;
  public masonryOptions: NgxMasonryOptions = {
    transitionDuration: '0',
    horizontalOrder: true,
    gutter: 18,
    fitWidth: true
  };
  private WindowSizeSubscription: Subscription;
  constructor(
    private userService: UserService,
    private feedService: FeedService,
    private configService: ConfigService,
    private massageService: MessageService,
    private dialogService: DialogService,
    private router: Router
  ) { }

  ngOnInit() {
    jquery("mat-sidenav-container").css("top", "122px");
    this.feedService.feedFilteringDTO = new FilteringDTO();
    this.id = this.userService.userId;
    this.updateFeed = this.feedService
      .getNewPosts().subscribe(observablePosts => {
        observablePosts.subscribe((observablePosts: FeedReturnObject) => {
          this.posts = this.posts.concat(observablePosts.newPosts);
          this.loading = false;
          if (observablePosts.offset == -1) {
            this.endOfFeed = true;
          }

        })
      });
    this.feedService.updateExploreFeed(this.id);
    this.feedSubsription = this.massageService.getMessage().subscribe(msg => {
      if (msg) {
        if (msg.msg == 'update-feed') {
          this.posts = [];
          this.feedService.updateExploreFeed(this.id);
        }
      }
    });

    this.WindowSizeSubscription = this.configService.windowSizeChanged
      .subscribe(
        value => {
          if (value.width >= 600) {
            this.desktop = true;
          }

          if (value.width <= 600) {
            this.desktop = false;
            let w = (value.width);
          }
        });
  }

  onScroll() {
    if (!this.endOfFeed) {
      this.feedService.updateExploreFeed(this.id);
      this.loading = true;
    } else {
      this.loading = false;
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

  public ngOnDestroy(): void {
    this.onDestroy.next();
    this.feedSubsription.unsubscribe();
    this.WindowSizeSubscription.unsubscribe();
  }
}
