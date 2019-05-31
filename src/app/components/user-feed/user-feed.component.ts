import { Component, OnInit } from '@angular/core';
import { Observable, Subscriber, Subscription, Observer } from 'rxjs';
import { UserPost } from '../../models/UserPost';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { tap, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.component.html',
  styleUrls: ['./user-feed.component.css']
})
export class UserFeedComponent implements OnInit {
  //posts = new BehaviorSubject([]);
  posts: Array<any> = [];
  offset: number = 0;
  id = 0;
  //subscrition: Subscription;
  onDestroy: Subject<void> = new Subject<void>();

  constructor(
    private feedService: FeedService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntil(this.onDestroy))
      .subscribe(params => {
        this.id = +params['id']; // CHNAGE TAKE USER ID FROM USER SERVICE
        //this.generateUserFeed(0, this.id);
      });
    this.generateUserFeed(0, this.id);
  }

  private processData = posts => {
    this.posts = this.posts.concat(posts);
  };

  generateUserFeed(offset: number, userId: number) {
    this.feedService
      .getUserFeed(userId, offset)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(this.processData);
  }

  fetchImages() {
    this.generateUserFeed(this.offset, this.id);
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }
}
