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
import { GlobalVariable } from '../../../global';

@Component({
  selector: 'app-user-profile-info',
  templateUrl: './user-profile-info.component.html',
  styleUrls: ['./user-profile-info.component.css']
})
export class UserProfileInfoComponent implements OnInit {
  masterId: number;
  slaveId: number;
  follows: boolean;
  user: User;
  userProfileImageSrc: string;
  src: any;
  following: Observable<number>;
  followers: Observable<number>;
  numberOfPosts: Observable<number>;
  userLoaded: Promise<boolean>;
  flag: number = 1;
  clicked: boolean = false;
  onDestroy: Subject<void> = new Subject<void>();

  private baseApiUrl = GlobalVariable.BASE_API_URL;
  AWSImgAddr = this.baseApiUrl + '/image?s3key=';

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private postService: PostService
  ) {}

  ngOnInit() {
    const routeParams = this.activatedRoute.snapshot.params;
    this.masterId = routeParams.id;
    this.updateUser();
    this.userService.checkIsFollowing(this.masterId).then(
      res => {
        this.follows = res.valueOf();
      },
      error => {
        console.log(error);
      }
    );

    this.following = this.userService.getNumberOfFollowing(this.masterId);
    this.followers = this.userService.getNumberOfFollowers(this.masterId);
    this.numberOfPosts = this.userService.getNumberOfPosts(this.masterId);
  }

  updateUser() {
    this.userService
      .getUserDetails(this.masterId)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(res => {
        this.user = res;
        this.userProfileImageSrc = this.AWSImgAddr + this.user.profileImageAddr;
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
    var title;
    if (flag) {
      title = 'Followears';
    } else {
      title = 'Following';
    }

    const dialogRef = this.dialog.open(GenerateFollowListComponent, {
      width: '320px',
      height: '50%',
      data: {
        flag: flag,
        id: this.masterId,
        title: title
      },
      panelClass: 'overlay-fol-list'
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }
}
