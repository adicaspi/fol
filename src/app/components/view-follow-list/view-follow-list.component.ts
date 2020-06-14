import { Component, OnInit, Input, Inject, OnDestroy, Optional } from '@angular/core';

import { Subject, Observable, fromEvent } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { takeUntil, map } from 'rxjs/operators';
import { LocationService } from '../../services/location.service';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { DialogService } from '../../services/dialog.service';
import { ErrorsService } from '../../services/errors.service';
import { NgxSpinnerService } from '../../../../node_modules/ngx-spinner';
import * as jquery from 'jquery';
import { DiscoverPeopleDTO } from '../../models/DiscoverPeopleDTO';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-view-follow-list',
  templateUrl: './view-follow-list.component.html',
  styleUrls: ['./view-follow-list.component.scss']
})
export class ViewFollowListComponent implements OnInit {
  followsFeed: Array<any> = [];
  var: Observable<any>;
  desktop: boolean;
  id: number;
  userId: number;
  offset: number = 0;
  flag: number;
  dialogTitle: string;
  postId: number;
  onDestroy: Subject<void> = new Subject<void>();
  postsToShow = [];
  list: number;
  showSpinner: boolean = true;
  followingUsersChanged: boolean = false;
  endOfFeed: boolean = false;
  private baseApiUrl = environment.BASE_API_URL;

  constructor(private feedService: FeedService,
    private userService: UserService,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.userId = this.userService.userId;
    this.postId = this.configService.getGeneralSession('postId');
    if (this.configService.getGeneralSession('list')) {

      this.dialogTitle = "Likes";
      this.generateLikeList(this.postId);
    }
    else {

      this.flag = this.configService.getGeneralSession('flag');
      this.id = this.configService.getGeneralSession('id');
      if (this.flag) {
        this.generateFollowsMasters(this.offset);
        this.dialogTitle = "Following";
      }
      else {
        this.generateFollowsSlaves(this.offset);
        this.dialogTitle = "Followers";
      }
    }
    if (this.configService.getGeneralSession('desktop')) {
      this.desktop = true;
    } else {
      this.desktop = false;
    }
  }

  private processData = followsFeed => {
    this.followsFeed = this.followsFeed.concat(followsFeed);
    this.offset = this.followsFeed.length;
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
    });
    this.showSpinner = false;

    if (followsFeed.length > 0) {
      if (this.configService.getGeneralSession('list') == 0) {
        if (this.flag) {
          this.generateFollowsMasters(this.offset);
        }
        else {
          this.generateFollowsSlaves(this.offset);
        }
      }
    }

  };

  generateFollowsMasters(offset: number) {
    this.feedService
      .getFollowMasters(this.id, this.offset)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(this.processData);

  }

  generateFollowsSlaves(offset: number) {
    this.feedService
      .getFollowSlaves(this.id, offset)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(this.processData);

  }

  generateLikeList(postId) {
    this.feedService.likeList(postId).pipe(takeUntil(this.onDestroy))
      .subscribe(this.processData);
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
