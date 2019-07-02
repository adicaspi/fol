import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as $ from 'jquery';

import { PostService } from '../../services/post.service';

import { NgxMasonryOptions } from 'ngx-masonry';

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

  count = 0;
  public masonryOptions: NgxMasonryOptions = {
    transitionDuration: '0',
    horizontalOrder: true,
    gutter: 10
  };
  constructor(
    private userService: UserService,
    private feedService: FeedService,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.id = this.userService.userId;
    //this.id = 655; //DELETE ID

    this.generateTimelineFeed(0, this.id);
  }

  private processData = posts => {
    this.posts = this.posts.concat(posts);
    posts.forEach(post => {
      this.postService
        .getImage(post.postImageAddr)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(res => {
          this.createImageFromBlob(res, post);
        });
    });
  };

  generateTimelineFeed(offset: number, id: number) {
    this.feedService
      .getTimeLineFeed(offset, id)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(this.processData);
  }
  fetchImages() {
    this.generateTimelineFeed(this.offset, this.id);
  }

  createImageFromBlob(image: Blob, post: any) {
    let reader = new FileReader();
    let handler;
    reader.addEventListener(
      'load',
      (handler = () => {
        let postObject = {
          post: post,
          imgSrc: reader.result
        };

        this.postsToShow.push(postObject);
      }),
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }
}
