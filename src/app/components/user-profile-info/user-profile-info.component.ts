import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GenerateFollowListComponent } from '../generate-follow-list/generate-follow-list.component';
import { FeedService } from '../../services/feed.service';

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
  userProfileImage: any;
  following: Observable<number>;
  followers: Observable<number>;
  numberOfPosts: Observable<number>;
  userLoaded: Promise<boolean>;
  flag: number = 1;
  clicked: boolean = false;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    const routeParams = this.activatedRoute.snapshot.params;
    this.masterId = routeParams.id;
    this.userService.checkIsFollowing(this.masterId).then(
      res => {
        this.follows = res.valueOf();
      },
      error => {
        console.log(error);
      }
    );
    this.updateUser();
    this.following = this.userService.getNumberOfFollowing(this.masterId);
    this.followers = this.userService.getNumberOfFollowers(this.masterId);
    this.numberOfPosts = this.userService.getNumberOfPosts(this.masterId);
  }

  updateUser() {
    this.user = this.userService.getUserDetails(this.masterId);
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

  openDialog(): void {
    const dialogRef = this.dialog.open(GenerateFollowListComponent, {
      width: '350px',
      height: '250px',
      data: {
        flag: 1,
        id: this.masterId
      }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }
}
