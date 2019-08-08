import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GenerateFollowListComponent } from '../generate-follow-list/generate-follow-list.component';
import { PostService } from '../../services/post.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-profile-info',
  templateUrl: './user-profile-info.component.html',
  styleUrls: ['./user-profile-info.component.css']
})
export class UserProfileInfoComponent implements OnInit {
  masterId: number;
  slaveId: number;
  follows: boolean;
  user: Observable<User>;
  userProfileImageSrc = [];
  src: any;
  following: Observable<number>;
  followers: Observable<number>;
  numberOfPosts: Observable<number>;
  userLoaded: Promise<boolean>;
  flag: number = 1;
  clicked: boolean = false;
  onDestroy: Subject<void> = new Subject<void>();

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private postService: PostService
  ) {}

  ngOnInit() {
    const routeParams = this.activatedRoute.snapshot.params;
    this.masterId = routeParams.id;
    // this.userService.checkIsFollowing(this.masterId).then(
    //   res => {
    //     this.follows = res.valueOf();
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
    this.updateUser();
    this.following = this.userService.getNumberOfFollowing(this.masterId);
    this.followers = this.userService.getNumberOfFollowers(this.masterId);
    this.numberOfPosts = this.userService.getNumberOfPosts(this.masterId);
  }

  updateProfileImage(user) {
    this.postService
      .getImage(user.profileImageAddr)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(res => {
        console.log('im res', res);
        this.userProfileImageSrc = this.postService.createImageFromBlob(
          res,
          user.profileImageAddr,
          this.userProfileImageSrc
        );
      });
  }

  updateUser() {
    // this.userService.user.pipe(takeUntil(this.onDestroy)).subscribe(user => {
    //   this.updateProfileImage(user);
    //   this.user = user;
    // });

    this.user = this.userService
      .getUserDetails(this.masterId)
      .pipe(takeUntil(this.onDestroy));
    console.log('im in update user');
    this.user.subscribe(res => {
      this.updateProfileImage(res);
    });
  }

  follow() {
    //if user is already following then unfollow
    if (this.follows) {
      this.userService.unFollow(this.masterId);
      this.follows = false;
    } else {
      this.userService.follow(this.masterId);
      this.follows = true;
    }
  }

  modalFlag(flag: number) {
    this.flag = flag;
    this.clicked = true;
  }

  openDialog(flag): void {
    const dialogRef = this.dialog.open(GenerateFollowListComponent, {
      width: '350px',
      height: '250px',
      data: {
        flag: flag,
        id: this.masterId
      }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }
}
