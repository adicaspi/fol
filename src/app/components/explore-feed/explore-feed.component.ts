import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import * as $ from 'jquery';

import { PostService } from '../../services/post.service';

import { NgxMasonryOptions } from 'ngx-masonry';
import { GlobalVariable } from '../../../global';
import { ErrorsService } from '../../services/errors.service';

@Component({
  selector: 'app-explore-feed',
  templateUrl: './explore-feed.component.html',
  styleUrls: ['./explore-feed.component.css']
})
export class ExploreFeedComponent implements OnInit {
  id: number;
  posts: Array<any> = [];
  postsToShow = [];
  offset: number = 0;
  onDestroy: Subject<void> = new Subject<void>();
  private feedSubsription: Subscription
  private baseApiUrl = GlobalVariable.BASE_API_URL;

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
    this.id = this.userService.userId;
    this.generateExploreFeed(this.id);
    this.feedSubsription = this.errorsService.getMessage().subscribe(msg => {
      if (msg.error == 'update-exlporefeed') {
        this.postsToShow = [];
        this.generateExploreFeed(this.id);
      }
    });
  }

  private processData = posts => {
    this.posts = this.posts.concat(posts);
    posts['feedPosts'].forEach(post => {
      let baseAPI = this.baseApiUrl + '/image?s3key=';
      let postObject = {
        post: post,
        postImgSrc: baseAPI + post.postImageAddr,
        // profileImgSrc: baseAPI + post.userProfileImageAddr
      };
      this.postsToShow.push(postObject);
    });
  };

  generateExploreFeed(id: number) {
    this.feedService
      .getExploreFeed(id)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(this.processData);
  }
  fetchImages() {
    this.generateExploreFeed(this.id);
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }
}
