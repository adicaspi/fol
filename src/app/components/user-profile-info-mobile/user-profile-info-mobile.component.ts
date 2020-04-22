import { Component, Input, OnInit } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../services/dialog.service';
import { ConfigService } from '../../services/config.service';
import { UserProfileInfoComponent } from '../user-profile-info/user-profile-info.component';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../models/User';

@Component({
  selector: 'app-user-profile-info-mobile',
  templateUrl: './user-profile-info-mobile.component.html',
  styleUrls: ['./user-profile-info-mobile.component.scss']
})
export class UserProfileInfoMobileComponent implements OnInit {
  //@Input() user;
  public currMasterId: number;
  public slaveId: number;
  public follows: boolean;
  public user: Observable<User>;
  public userId: number;
  public userProfileImageSrc: string;
  public src: any;
  // public following: Observable<number>;
  // public followers: Observable<number>;
  // public numberOfPosts: Observable<number>;
  public following: number;
  public followers: number;
  public numberOfPosts: number;
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
  //public followingDialogRef: MatDialogRef<{}, any>;
  public WindowSizeSubscription: Subscription;
  public previousUrl: string = "";
  public currentUrl: string = "";

  constructor(public userService: UserService,
    public activatedRoute: ActivatedRoute,
    public dialogService: DialogService,
    public router: Router,
    public configService: ConfigService,
    public location: LocationService
  ) {

  }

  ngOnInit() {
    //console.log("user", this.user);
    this.userId = this.userService.userId;
    const routeParams = this.activatedRoute.snapshot.params;
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
  }

  getNumFollowing() {
    this.userService.getNumberOfFollowing(this.currMasterId).pipe(takeUntil(this.onDestroy)).subscribe(res => { this.following = res });
  }

  getNumFollowers() {
    //this.followers = this.userService.getNumberOfFollowers(this.currMasterId);
    this.userService.getNumberOfFollowers(this.currMasterId).pipe(takeUntil(this.onDestroy)).subscribe(res => { this.followers = res });
  }

  getNumPosts() {
    //this.numberOfPosts = this.userService.getNumberOfPosts(this.currMasterId);
    this.userService.getNumberOfPosts(this.currMasterId).pipe(takeUntil(this.onDestroy)).subscribe(res => { this.numberOfPosts = res });
  }

  updateUser(id) {
    // this.user = this.userService.getUserDetails(id);
    this.user = this.userService.getUserProfileInfo(id);
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
    this.dialogService.desktop = false;
    this.router.navigate(['following']);

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
    // this.WindowSizeSubscription.unsubscribe();
  }


}
