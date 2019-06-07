import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

import { FeedService } from '../../services/feed.service';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-timeline-feed',
  templateUrl: './timeline-feed.component.html',
  styleUrls: ['./timeline-feed.component.css']
})
export class TimelineFeedComponent implements OnInit {
  id: number;
  posts: Array<any> = [];
  offset: number = 0;
  onDestroy: Subject<void> = new Subject<void>();
  constructor(
    private userService: UserService,
    private feedService: FeedService
  ) {}

  ngOnInit() {
    this.id = this.userService.getCurrentUser();
    this.id = 655;
    this.generateTimelineFeed(0, this.id);
  }

  private processData = posts => {
    this.posts = this.posts.concat(posts);
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
