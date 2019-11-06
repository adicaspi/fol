import { Component, OnInit } from '@angular/core';
import { Routes, Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
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


@Component({
  selector: 'app-user-profile-info',
  templateUrl: './user-profile-info.component.html',
  styleUrls: ['./user-profile-info.component.css']
})
export class UserProfileInfoComponent implements OnInit {
  currMasterId: number;
  slaveId: number;
  follows: boolean;
  user: User;
  userId: number;
  userProfileImageSrc = [];
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
  private anyErrors: boolean;
  private finished: boolean;



  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private postService: PostService,
    private dialogService: DialogService,
    private router: Router,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    const routeParams = this.activatedRoute.snapshot.params;
    this.activatedRoute.params
      .pipe(takeUntil(this.onDestroy))
      .subscribe(params => {
        this.currMasterId = +params['id']; // CHNAGE TAKE USER ID FROM USER SERVICE
        this.updateUser(this.currMasterId);
      });
    this.currMasterId = parseInt(routeParams.id);
    this.userId = this.userService.userId;
    this.userService.checkIsFollowing(this.currMasterId).pipe(takeUntil(this.onDestroy)).subscribe(res => {
      this.follows = res;
    })

    this.following = this.userService.getNumberOfFollowing(this.currMasterId);
    this.followers = this.userService.getNumberOfFollowers(this.currMasterId);
    this.numberOfPosts = this.userService.getNumberOfPosts(this.currMasterId);
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

  updateProfileImage(user) {
    this.postService
      .getImage(user.profileImageAddr)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(res => {
        this.userProfileImageSrc = this.postService.createImageFromBlob(
          res,
          user.profileImageAddr,
          this.userProfileImageSrc
        );
      });
  }

  updateUser(id) {
    this.userService
      .getUserDetails(id)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(user => {
        this.user = user;
        this.updateProfileImage(user);
        if (this.userId == this.currMasterId) {
          this.userProfile = true;
        }
      });
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
