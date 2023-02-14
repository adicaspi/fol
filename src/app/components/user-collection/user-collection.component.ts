import { Component, OnInit } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { Subscription, Subject, Observable } from '../../../../node_modules/rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { User } from '../../models/User';


@Component({
  selector: 'app-user-collection',
  templateUrl: './user-collection.component.html',
  styleUrls: ['./user-collection.component.scss']
})
export class UserCollectionComponent implements OnInit {

  constructor(private feedService: FeedService, private userService: UserService, private route: ActivatedRoute) { }
  userId = 1;
  collectionCreatedByUserId = 0;
  updateFeed: Subscription
  onDestroy: Subject<void> = new Subject<void>();
  posts = [];
  collectionId: string;
  collectionInfo: Observable<any>;
  public user: Observable<User>;

  ngOnInit() {
    this.userId = this.userService.getCurrentUser();
    if (this.userId == undefined) {
      this.userId = 4;
    }
    this.collectionId = this.route.snapshot.paramMap.get('id');
    this.getCollectionPosts();
    this.getCollectionInfo();
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

  getCollectionInfo() {
    this.feedService.getCollectionInfo(this.userId, this.collectionId).pipe(takeUntil(this.onDestroy)).subscribe(result => {
      this.collectionInfo = result;
      this.collectionCreatedByUserId = result.userId;
      this.updateUser(result.userId)
    });
    ;
  }

  updateUser(id) {
    this.user = this.userService.getUserProfileInfo(id);
  }

}
