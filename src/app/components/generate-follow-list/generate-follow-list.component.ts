import { Component, OnInit, Input, Inject } from '@angular/core';

import { Subject } from 'rxjs';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { GlobalVariable } from '../../../global';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-generate-follow-list',
  templateUrl: './generate-follow-list.component.html',
  styleUrls: ['./generate-follow-list.component.css']
})
export class GenerateFollowListComponent implements OnInit {
  // followsFeed: Observable<Array<FollowItem>>;
  followsFeed: Array<any> = [];
  desktop: boolean;
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
    private dialogService: DialogService
    // private dialogRef: MatDialogRef<GenerateFollowListComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.desktop = this.dialogService.desktop;
    // this.flag = this.data.flag;
    // this.id = this.data.id;
    // this.generateFollowsFeed(0);
    // this.dialogTitle = this.data.title;
    this.flag = 1;
    this.id = 1;
    this.generateFollowsFeed(0);
    //this.dia = 'following';
  }

  private processData = followsFeed => {
    this.followsFeed = this.followsFeed.concat(followsFeed);
    followsFeed.forEach(follower => {
      this.userService.checkIsFollowing(follower.id).subscribe(res => {
        follower.follows = res;
        let baseAPI = this.baseApiUrl + '/image?s3key=';
        let postObject = {
          post: follower,
          imgSrc: baseAPI + follower.profileImageAddr
        };
        this.postsToShow.push(postObject);
      });
      this.showSpinner = false;
    });
  };

  generateFollowsFeed(offset: number) {
    console.log("in generate")
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
    this.dialogService.closeFollowingDialog();
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }
}
