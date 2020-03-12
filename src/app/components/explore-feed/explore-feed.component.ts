import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user.service';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

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
import { NgxSpinnerService } from '../../../../node_modules/ngx-spinner';

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
  windowWidth: number;
  showNoPostsMessage: boolean = false;
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
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    jquery("mat-sidenav-container").css("top", "80px");
    this.feedService.feedFilteringDTO = new FilteringDTO();
    this.id = this.userService.userId;
    this.updateFeed = this.feedService
      .getNewPosts().subscribe(observablePosts => {
        observablePosts.subscribe((observablePosts: any) => {
          this.posts = this.posts.concat(observablePosts.newPosts);
          if (this.posts.length == 0) {
            this.showNoPostsMessage = true;
          } else {
            this.showNoPostsMessage = false;
          }
          this.spinner.hide();
        })
      });
    this.feedService.updateExploreFeed(this.id);
    this.feedSubsription = this.massageService.getMessage().subscribe(msg => {
      if (msg) {
        if (msg.msg == 'update-feed') {
          this.spinner.show();
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
            this.masonryOptions.gutter = 12;
          }
          this.windowWidth = value.width;
        });
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

  discoverPeople() {
    this.router.navigate(['discover-people-user', this.id]);
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
    this.feedSubsription.unsubscribe();
    this.WindowSizeSubscription.unsubscribe();
  }
}
