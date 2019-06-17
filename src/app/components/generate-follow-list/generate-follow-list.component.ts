import { Component, OnInit, Input, Inject } from '@angular/core';
import { FollowItem } from '../../models/FollowItem';
import { Observable, Subject } from 'rxjs';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-generate-follow-list',
  templateUrl: './generate-follow-list.component.html',
  styleUrls: ['./generate-follow-list.component.css']
})
export class GenerateFollowListComponent implements OnInit {
  // followsFeed: Observable<Array<FollowItem>>;
  followsFeed: Array<any> = [];
  id: number;
  offset: number;
  flag: number;
  onDestroy: Subject<void> = new Subject<void>();
  postsToShow = [];
  showSpinner: boolean = true;
  constructor(
    private feedService: FeedService,
    private postService: PostService,
    private userService: UserService,
    private dialogRef: MatDialogRef<GenerateFollowListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.flag = this.data.flag;
    this.id = this.data.id;
    this.generateFollowsFeed(0);
  }

  private processData = followsFeed => {
    this.followsFeed = this.followsFeed.concat(followsFeed);
    followsFeed.forEach(follower => {
      this.userService.checkIsFollowing(follower.id).then(res => {
        follower.follows = res.valueOf();

        this.postService
          .getImage(follower.profileImageAddr)
          .pipe(takeUntil(this.onDestroy))
          .subscribe(
            res => {
              this.postsToShow = this.postService.createImageFromBlob(
                res,
                follower,
                this.postsToShow
              );
              this.showSpinner = false;
            },
            error => {
              console.log(error);
            }
          );
      });
    });
  };
  generateFollowsFeed(offset: number) {
    this.feedService
      .getSlavesMasters(this.id, offset, this.flag)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(this.processData);
  }

  follow(item) {
    //if user is already following then unfollow
    if (item['post']['follows']) {
      //this.userService.unFollow(item['post']['id']);
      item['post']['follows'] = false;
    } else {
      //this.userService.follow(item['post']['id']);
      item['post']['follows'] = true;
    }
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }
}
