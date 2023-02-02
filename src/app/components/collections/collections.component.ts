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
  collectionId: string;
  constructor(private feedService: FeedService, private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userId = this.userService.getCurrentUser();
    this.collectionId = this.route.snapshot.paramMap.get('id');
    this.getCollectionPosts();
  }


  getCollectionPosts() {
    this.feedService
      .getCollectionPosts(this.userId, this.collectionId).pipe(takeUntil(this.onDestroy)).subscribe(result => {
        this.posts = this.posts.concat(result.newPosts);
        console.log(this.posts);
      }, error => {
        console.log(error);
      })

  }
}
