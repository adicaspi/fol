import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Routes, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LocationService } from '../../services/location.service';
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
  public currMasterId: number;
  public slaveId: number;
  public follows: boolean;
  public user: Observable<User>;
  public userId: number;
  public userProfileImageSrc: string;
  public src: any;
  public following: Observable<number>;
  public followers: Observable<number>;
  public numberOfPosts: Observable<number>;
  public userLoaded: Promise<boolean>;
  public flag: number = 1;
  public clicked: boolean = false;
  public onDestroy: Subject<void> = new Subject<void>();
  public desktop: boolean = false;
  public userProfile: boolean = false;
  public subscription: Subscription;
  public msgSubscription: Subscription;
  public anyErrors: boolean;
  public finished: boolean;
  public followingDialogRef: MatDialogRef<{}, any>;
  public WindowSizeSubscription: Subscription;
  public previousUrl: string = "";
  public currentUrl: string = "";

  constructor(
    public userService: UserService,
    public activatedRoute: ActivatedRoute,
    public dialogService: DialogService,
    public router: Router,
    public configService: ConfigService,
    public location: LocationService
  ) { }

  ngOnInit() {
    this.userId = this.userService.userId;
    const routeParams = this.activatedRoute.snapshot.params;
    this.currMasterId = parseInt(routeParams.id);
    if (this.userId == this.currMasterId) {
      this.userProfile = true;
    }

    this.WindowSizeSubscription = this.configService.windowSizeChanged
      .subscribe(
        value => {
          if (value.width >= 600) {
            this.desktop = true;
          }

          if (value.width <= 600) {
            this.desktop = false;
          }
        });




    this.updateUser(this.currMasterId);
    this.userService.checkIsFollowing(this.currMasterId).pipe(takeUntil(this.onDestroy)).subscribe(res => {
      this.follows = res;
    })
    this.getNumFollowers();
    this.getNumFollowing();
    this.getNumPosts();
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

  logout() {
    this.userService.logout();
    this.router.navigate(['landing']);
  }

  goBackPage() {
    this.location.goBack();
  }

  ngOnDestroy(): void {
    this.WindowSizeSubscription.unsubscribe();
  }

}
