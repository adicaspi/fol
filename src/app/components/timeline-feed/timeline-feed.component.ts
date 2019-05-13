import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TimelinePost } from '../../models/TimelinePost';
import { Observable } from 'rxjs';
import { FeedService } from '../../services/feed.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tap } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-timeline-feed',
  templateUrl: './timeline-feed.component.html',
  styleUrls: ['./timeline-feed.component.css']
})
export class TimelineFeedComponent implements OnInit {
  id: number;
  posts = new BehaviorSubject([]);
  offset: number = 0;
  constructor(
    private userService: UserService,
    private feedService: FeedService
  ) {}

  ngOnInit() {
    this.id = this.userService.getCurrentUser();
    this.id = 655;
    this.generateTimelineFeed(0, this.id);
  }

  generateTimelineFeed(offset: number, id: number) {
    this.feedService
      .getTimeLineFeed(offset, id)
      .pipe(
        tap(resulst => {
          const new_posts = resulst;
          /// Get current movies in BehaviorSubject
          const current_posts = this.posts.getValue();

          /// Concatenate new movies to current movies
          this.posts.next(_.concat(current_posts, new_posts));

          this.offset += new_posts.length;
        })
      )
      .subscribe();
  }
  fetchImages() {
    this.generateTimelineFeed(this.offset, this.id);
    console.log('im offest', this.offset);
  }
}
