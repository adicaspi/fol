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
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-explore-feed-general',
  templateUrl: './explore-feed-general.component.html',
  styleUrls: ['./explore-feed-general.component.scss']
})
export class ExploreFeedGeneralComponent implements OnInit {
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
    private spinner: NgxSpinnerService,
    private titleService: Title,
    private meta: Meta
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Explore');
    this.meta.addTag({ name: 'description', content: "Explore Followear! click here to see fashion items from your favorite stores" });
    this.meta.addTag({ name: 'robots', content: 'index, follow' });
    this.spinner.show();
    this.feedService.feedFilteringDTO = new FilteringDTO();
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
    this.feedService.updateGeneralExploreFeed();
    this.feedSubsription = this.massageService.getMessage().subscribe(msg => {
      if (msg) {
        if (msg.msg == 'update-feed') {
          this.spinner.show();
          this.posts = [];
          this.feedService.updateGeneralExploreFeed();
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
    this.router.navigate(['feed-discover-people']);
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
    this.feedSubsription.unsubscribe();
    this.WindowSizeSubscription.unsubscribe();
  }

}
