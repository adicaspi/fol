import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { LocationService } from '../../services/location.service';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { DialogService } from '../../services/dialog.service';
import { ErrorsService } from '../../services/errors.service';
import { NgxSpinnerService } from '../../../../node_modules/ngx-spinner';

@Component({
  selector: 'app-generate-follow-list',
  templateUrl: './generate-follow-list.component.html',
  styleUrls: ['./generate-follow-list.component.css']
})
export class GenerateFollowListComponent implements OnInit, OnDestroy {
  // followsFeed: Observable<Array<FollowItem>>;
  followsFeed: Array<any> = [];
  var: Observable<any>;
  desktop: boolean;
  id: number;
  userId: number;
  offset: number;
  flag: number;
  dialogTitle: String;
  onDestroy: Subject<void> = new Subject<void>();
  postsToShow = [];
  showSpinner: boolean = true;
  followingUsersChanged: boolean = false;
  endOfFeed: boolean = false;
  private baseApiUrl = environment.BASE_API_URL;
  constructor(
    private feedService: FeedService,
    private userService: UserService,
    private dialogService: DialogService,
    private router: Router,
    private location: LocationService,
    private errorsService: ErrorsService,
    private spinner: NgxSpinnerService
    // private dialogRef: MatDialogRef<GenerateFollowListComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    //this.spinner.show();
    this.userId = this.userService.userId;
    this.desktop = this.dialogService.desktop;
    this.flag = this.dialogService.followingDialogDataObject.flag;
    this.id = this.dialogService.followingDialogDataObject.userId;
    this.dialogTitle = this.dialogService.followingDialogDataObject.title;
    if (this.flag) {
      this.generateFollowsMasters(0);
    }
    else {
      this.generateFollowsSlaves(0);
    }
  }

  private processData = followsFeed => {
    if (followsFeed == "endOfFeed") {
      this.endOfFeed = true;
      console.log("end of");
    }
    else {
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
    }
    this.showSpinner = false;
  };

  generateFollowsMasters(offset: number) {
    this.feedService
      .getFollowMasters(this.id, offset)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(this.processData);
  }

  generateFollowsSlaves(offset: number) {
    this.feedService
      .getFollowSlaves(this.id, offset)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(this.processData);
  }

  follow(item) {

    //if user is already following then unfollow
    if (item['post']['follows']) {
      this.userService.unFollow(item['post']['id']);
      item['post']['follows'] = false;
    } else {
      this.userService.follow(item['post']['id']);
      item['post']['follows'] = true;
    }
    this.followingUsersChanged = true;
  }

  onScroll() {
    if (!this.endOfFeed) {
      if (this.flag) {
        this.generateFollowsMasters(this.offset);
      }
      else {
        this.generateFollowsSlaves(this.offset);
      }
      this.showSpinner = true;
    } else {
      this.showSpinner = false;
    }
  }

  userProfile(user) {
    this.router.navigate(['profile', user['post']['id']]);
    this.closeModal();
  }

  closeModal() {
    this.dialogService.closeFollowingDialog(this.followingUsersChanged)
  }

  goBackPage() {
    this.location.goBack();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
