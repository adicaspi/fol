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
import { MatDialog } from '../../../../node_modules/@angular/material';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import mixpanel from 'mixpanel-browser';

@Component({
  selector: 'app-user-profile-info-mobile',
  templateUrl: './user-profile-info-mobile.component.html',
  styleUrls: ['./user-profile-info-mobile.component.scss']
})
export class UserProfileInfoMobileComponent implements OnInit {
  //@Input() user;
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
  //public followingDialogRef: MatDialogRef<{}, any>;
  public WindowSizeSubscription: Subscription;
  public previousUrl: string = "";
  public currentUrl: string = "";

  constructor(public userService: UserService,
    public activatedRoute: ActivatedRoute,
    public dialogService: DialogService,
    public router: Router,
    public configService: ConfigService,
    public location: LocationService,
    public dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.userId = this.userService.userId;
    //if (this.uid == null) {
    //const routeParams = this.activatedRoute.snapshot.params;
    //this.currMasterId = parseInt(routeParams.id);
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.onDestroy))
      .subscribe((params) => {
        this.currMasterId = +params.get('id');
        this.updateUser(this.currMasterId);
        this.getNumFollowers(this.currMasterId);
        this.getNumFollowing(this.currMasterId);
        this.getNumPosts(this.currMasterId);
      });
    //} else {
    //this.currMasterId = this.uid;
    //}
    if (this.userId == this.currMasterId) {
      this.userProfile = true;
    }

    if (this.userId) {
      this.userService.checkIsFollowing(this.currMasterId).pipe(takeUntil(this.onDestroy)).subscribe(res => {
        this.follows = res;
      })
    }

  }

  getNumFollowing(id) {
    this.userService.getNumberOfFollowing(id).pipe(takeUntil(this.onDestroy)).subscribe(res => { this.following = res });
  }

  getNumFollowers(id) {
    //this.followers = this.userService.getNumberOfFollowers(this.currMasterId);
    this.userService.getNumberOfFollowers(id).pipe(takeUntil(this.onDestroy)).subscribe(res => { this.followers = res });
  }

  getNumPosts(id) {
    //this.numberOfPosts = this.userService.getNumberOfPosts(this.currMasterId);
    this.userService.getNumberOfPosts(id).pipe(takeUntil(this.onDestroy)).subscribe(res => { this.numberOfPosts = res });
  }

  updateUser(id) {
    // this.user = this.userService.getUserDetails(id);
    this.user = this.userService.getUserProfileInfo(id);
  }

  loginPage(): void {
    var pageWidth = this.desktop ? "420px" : "92vw";
    const dialogRef = this.dialog.open(LoginComponent, {
      width: pageWidth,
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
    var pageWidth = this.desktop ? "420px" : "92vw";
    const registerDialogRef = this.dialog.open(RegisterComponent, {
      width: pageWidth,
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
    this.configService.setGeneralSession('desktop', 0);
    this.configService.setGeneralSession('flag', flag);
    this.router.navigate(['follow-list', this.currMasterId]);

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
