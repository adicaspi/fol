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

@Component({
  selector: 'app-explore-feed',
  templateUrl: './explore-feed.component.html',
  styleUrls: ['./explore-feed.component.css']
})
export class ExploreFeedComponent implements OnInit {
  id: number;
  posts = [];
  offset: number = 0;
  onDestroy: Subject<void> = new Subject<void>();
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
  constructor(
    private userService: UserService,
    private feedService: FeedService,
    private postService: PostService,
    private errorsService: ErrorsService
  ) { }

  ngOnInit() {

    this.feedService.explorefeedFilteringDTO = new FilteringDTO();
    this.id = this.userService.userId;
    this.updateFeed = this.feedService
      .getNewPosts().subscribe(observablePosts => {
        observablePosts.subscribe((observablePosts: FeedReturnObject) => {
          this.posts = this.posts.concat(observablePosts.newPosts);
        })
      });
    this.feedService.updateExploreFeed(this.id);
    this.feedSubsription = this.errorsService.getMessage().subscribe(msg => {
      if (msg.error == 'update-exlporefeed') {
        this.posts = [];
        this.feedService.updateExploreFeed(this.id);
      }
    });
  }

  onScroll() {
    this.feedService.updateExploreFeed(this.id);
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
    this.feedSubsription.unsubscribe();
  }
}
