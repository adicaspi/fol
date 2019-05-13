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
    //this.posts = this.feedService.getUserFeed(this.id, offset);
    this.feedService
      .getUserFeed(this.id, offset)
      .pipe(
        tap(resulst => {
          const new_posts = resulst;
          /// Get current movies in BehaviorSubject
          const current_posts = this.posts.getValue();

          /// Concatenate new movies to current movies
          this.posts.next(_.concat(current_posts, new_posts));
        })
      )
      .subscribe();
  }

  fetchImages() {
    console.log('in fetch');
    this.generateUserFeed(this.offset, this.id);
  }
}
