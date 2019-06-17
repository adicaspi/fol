import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { PostService } from '../../services/post.service';
import { NgxMasonryOptions } from 'ngx-masonry';

@Component({
  selector: 'app-timeline-feed',
  templateUrl: './timeline-feed.component.html',
  styleUrls: ['./timeline-feed.component.css']
})
export class TimelineFeedComponent implements OnInit {
  id: number;
  posts: Array<any> = [];
  postsToShow = [];
  offset: number = 0;
  onDestroy: Subject<void> = new Subject<void>();

  public masonryOptions: NgxMasonryOptions = {
    transitionDuration: '0'
  };
  constructor(
    private userService: UserService,
    private feedService: FeedService,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.id = this.userService.getCurrentUser();
    this.id = 655;
    this.generateTimelineFeed(0, this.id);
  }

  private processData = posts => {
    this.posts = this.posts.concat(posts);
    posts.forEach(post => {
      this.postService
        .getImage(post.postImageAddr)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(res => {
          this.postsToShow = this.postService.createImageFromBlob(
            res,
            post,
            this.postsToShow
          );
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

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }
}
