import { Component, OnInit, Input, Inject } from '@angular/core';

import { Subject } from 'rxjs';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { GlobalVariable } from '../../../global';

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
  dialogTitle: String;
  onDestroy: Subject<void> = new Subject<void>();
  postsToShow = [];
  showSpinner: boolean = true;
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  constructor(
    private feedService: FeedService,
    private userService: UserService,
    private dialogRef: MatDialogRef<GenerateFollowListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    console.log('im data', this.data);
    this.flag = this.data.flag;
    this.id = this.data.id;
    this.generateFollowsFeed(0);
    this.dialogTitle = this.data.title;
  }

  private processData = followsFeed => {
    this.followsFeed = this.followsFeed.concat(followsFeed);
    followsFeed.forEach(follower => {
      this.userService.checkIsFollowing(follower.id).then(res => {
        follower.follows = res.valueOf();
        let baseAPI = this.baseApiUrl + '/image?s3key=';
        let postObject = {
          post: follower,
          imgSrc: baseAPI + follower.profileImageAddr
        };
        this.postsToShow.push(postObject);
        this.showSpinner = false;
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

  closeModal() {
    this.dialogRef.close();
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }
}
