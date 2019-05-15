import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserPost } from '../../models/UserPost';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tap } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.component.html',
  styleUrls: ['./user-feed.component.css']
})
export class UserFeedComponent implements OnInit {
  //posts: Observable<Array<UserPost>>;
  posts = new BehaviorSubject([]);

  offset: number = 0;
  id = 0;
  constructor(
    private feedService: FeedService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = +params['id'];
      this.generateUserFeed(0, this.id);
    });
  }

  generateUserFeed(offset: number, userId: number) {
    this.feedService
      .getUserFeed(this.id, offset)
      .pipe(
        tap(resulst => {
          const new_posts = resulst;
          /// Get current posts in BehaviorSubject
          const current_posts = this.posts.getValue();

          /// Concatenate new posts to current movies
          this.posts.next(_.concat(current_posts, new_posts));
          this.offset = new_posts.length;
        })
      )
      .subscribe();
  }

  fetchImages() {
    this.generateUserFeed(this.offset, this.id);
  }
}
