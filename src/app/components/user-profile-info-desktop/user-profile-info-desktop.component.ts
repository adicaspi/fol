import { Component, OnInit, Input } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { UserProfileInfoComponent } from '../user-profile-info/user-profile-info.component';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { DialogService } from '../../services/dialog.service';
import { ConfigService } from '../../services/config.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GenerateFollowListComponent } from '../generate-follow-list/generate-follow-list.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../models/User';
import { ViewFollowListComponent } from '../view-follow-list/view-follow-list.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-user-profile-info-desktop',
  templateUrl: './user-profile-info-desktop.component.html',
  styleUrls: ['./user-profile-info-desktop.component.scss']
})

export class UserProfileInfoDesktopComponent implements OnInit {
  @Input() uid?: number;
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
  public followingDialogRef: MatDialogRef<{}, any>;
  public WindowSizeSubscription: Subscription;
  public previousUrl: string = "";
  public currentUrl: string = "";

  constructor(public userService: UserService,
    public activatedRoute: ActivatedRoute,
    public dialogService: DialogService,
    public router: Router,
    public configService: ConfigService,
    public location: LocationService,
    public dialog: MatDialog,

  ) {

  }
  ngOnInit() {
    this.userId = this.userService.userId;
    if (this.uid == null) {
      const routeParams = this.activatedRoute.snapshot.params;
      this.currMasterId = parseInt(routeParams.id);
    } else {
      this.currMasterId = this.uid;
    }
    if (this.userId == this.currMasterId) {
      this.userProfile = true;
    }

    this.updateUser(this.currMasterId);
    if (this.userId) {
      this.userService.checkIsFollowing(this.currMasterId).pipe(takeUntil(this.onDestroy)).subscribe(res => {
        this.follows = res;
      })
    }
    this.getNumFollowers();
    this.getNumFollowing();
    this.getNumPosts();
  }

  getNumFollowing() {
    this.userService.getNumberOfFollowing(this.currMasterId).pipe(takeUntil(this.onDestroy)).subscribe(res => { this.following = res });
  }

  getNumFollowers() {
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

  loginPage(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '420px',
      height: 'unset',
      data: { close: true }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == "register") {
        this.registerPage();
      }
    })
  }

  registerPage() {
    const registerDialogRef = this.dialog.open(RegisterComponent, {
      width: '400px',
      height: 'unset',
      data: { close: true }
    });
    registerDialogRef.afterClosed().subscribe(res => {
      if (res == "login") {
        this.loginPage();
      }
    })
  }

  follow() {
    if (!this.userId) {
      this.loginPage();
    } else {
      //if user is already following then unfollow
      if (this.follows) {
        this.userService.unFollow(this.currMasterId);
        this.follows = false;
      } else {
        this.userService.follow(this.currMasterId);
        this.follows = true;
      }
    }
  }

  modalFlag(flag: number) {
    this.flag = flag;
    this.clicked = true;
  }

  openDialog(flag) {
    this.configService.setGeneralSession('id', this.currMasterId);
    this.configService.setGeneralSession('list', 0);
    this.configService.setGeneralSession('desktop', 1);
    this.configService.setGeneralSession('flag', flag);

    this.dialogService.desktop = true;
    const dialogRef = this.dialog.open(ViewFollowListComponent, {
      width: '440px'
    });

    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy)).subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.getNumFollowing();
      }
    });


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
    //this.WindowSizeSubscription.unsubscribe();
  }


}
