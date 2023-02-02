import { Component, OnInit } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable, Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {
  updateFeed: Subscription
  onDestroy: Subject<void> = new Subject<void>();
  posts = [];
  userId = 0;
  collectionId = 0;
  constructor(private feedService: FeedService, private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userId = this.userService.getCurrentUser();

  }

  getCollectionId() {
    this.route.queryParams
      .subscribe(params => {
        this.collectionId = params.id;
        console.log(this.collectionId); // price
      }, err => {
        console.log(err);
        //closeLoadingBar();
      },
        () => {
          this.getCollectionPosts();
        }
      )

  }

  getCollectionPosts() {
    this.updateFeed = this.feedService
      .getCollectionPosts(this.userId, this.collectionId).pipe(takeUntil(this.onDestroy)).subscribe(observablePosts => {
        observablePosts.pipe(takeUntil(this.onDestroy)).subscribe((observablePosts: any) => {
          this.posts = this.posts.concat(observablePosts.newPosts);
        }, error => {
          console.log(error);
        })
      })
  }
}
