import { Component, OnInit } from '@angular/core';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { Observable, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GenerateFollowListComponent } from '../generate-follow-list/generate-follow-list.component';
import { PostService } from '../../services/post.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DialogService } from '../../services/dialog.service';
import { ConfigService } from '../../services/config.service';
import { GlobalVariable } from '../../../global';

@Component({
  selector: 'app-user-profile-info',
  templateUrl: './user-profile-info.component.html',
  styleUrls: ['./user-profile-info.component.css']
})
export class UserProfileInfoComponent implements OnInit {
  currMasterId: number;
  slaveId: number;
  follows: boolean;
  user: Observable<User>;
  userId: number;
  userProfileImageSrc: string;
  src: any;
  following: Observable<number>;
  followers: Observable<number>;
  numberOfPosts: Observable<number>;
  userLoaded: Promise<boolean>;
  flag: number = 1;
  clicked: boolean = false;
  onDestroy: Subject<void> = new Subject<void>();
  desktop: boolean = false;
  userProfile: boolean = false;
  private subscription: Subscription;
  private msgSubscription: Subscription;
  private anyErrors: boolean;
  private finished: boolean;
  followingDialogRef: MatDialogRef<{}, any>;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private router: Router,
    private configService: ConfigService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    const routeParams = this.activatedRoute.snapshot.params;
    this.userId = this.userService.userId;
    this.currMasterId = parseInt(routeParams.id);
    if (this.userId == this.currMasterId) {
      this.userProfile = true;
    }
    this.updateUser(this.currMasterId);
    this.userService.checkIsFollowing(this.currMasterId).pipe(takeUntil(this.onDestroy)).subscribe(res => {
      this.follows = res;
    })
    this.getNumFollowers();
    this.getNumFollowing();
    this.getNumPosts();
    this.subscription = this.configService.windowSizeChanged.pipe(takeUntil(this.onDestroy))
      .subscribe(
        value => {
          if (value.width <= 600) {
            this.desktop = false;
          }
          else {
            this.desktop = true;
          }
        }),
      error => this.anyErrors = true,
      () => this.finished = true

  }

  getNumFollowing() {
    this.following = this.userService.getNumberOfFollowing(this.currMasterId);
  }

  getNumFollowers() {
    this.followers = this.userService.getNumberOfFollowers(this.currMasterId);
  }

  getNumPosts() {
    this.numberOfPosts = this.userService.getNumberOfPosts(this.currMasterId);
  }

  updateUser(id) {
    this.user = this.userService.getUserDetails(id);
  }

  follow() {
    //if user is already following then unfollow
    if (this.follows) {
      this.userService.unFollow(this.currMasterId);
      this.follows = false;
    } else {
      this.userService.follow(this.currMasterId);
      this.follows = true;
    }
  }

  modalFlag(flag: number) {
    this.flag = flag;
    this.clicked = true;
  }

  openDialog(flag) {
    var title;
    if (flag) {
      title = 'Following';
    } else {
      title = 'Followers';
    }
    this.dialogService.followingDialogDataObject.flag = flag;
    this.dialogService.followingDialogDataObject.userId = this.currMasterId;
    this.dialogService.followingDialogDataObject.title = title;
    if (this.desktop) {
      var componentName = 'followersList';
      this.dialogService.openModalWindow(
        GenerateFollowListComponent,
        componentName
      );
      this.dialogService.desktop = true;
      this.followingDialogRef = this.dialogService.followingDialogRef;
      this.followingDialogRef.afterClosed().pipe(takeUntil(this.onDestroy)).subscribe(result => {
        if (result) {
          this.getNumFollowing();
        }
      });

    }
    else {
      this.dialogService.desktop = false;
      this.router.navigate(['following']);
    }
  }


  settingsPage() {
    this.router.navigate(['settings', this.userService.userId]);
  }
}
