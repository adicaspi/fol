import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GenerateFollowListComponent } from '../generate-follow-list/generate-follow-list.component';
import { PostService } from '../../services/post.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-user-profile-info',
  templateUrl: './user-profile-info.component.html',
  styleUrls: ['./user-profile-info.component.css']
})
export class UserProfileInfoComponent implements OnInit {
  currMasterId: number;
  slaveId: number;
  follows: boolean;
  // user: Observable<User>;
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
  desktop: Boolean;
  userProfile: boolean = false;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private postService: PostService,
    private dialogService: DialogService,
    private router: Router
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

  openDialog(flag): void {
    var title;
    if (flag) {
      title = 'Followers';
    } else {
      title = 'Following';
    }
    const data = {
      flag: flag,
      id: this.currMasterId,
      title: title
    };

    var componentName = 'followersList';
    this.dialogService.openModalWindow(
      GenerateFollowListComponent,
      data,
      componentName
    );
  }

  settingsPage() {
    this.router.navigate(['settings', this.userService.userId]);
  }
}
