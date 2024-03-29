import { Component, OnInit } from '@angular/core';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject, Subscription, Observable } from '../../../../node_modules/rxjs';
import { FeedService } from '../../services/feed.service';
import * as angular from 'angular';
import $ from 'jquery';
import { ConfigService } from '../../services/config.service';
import { Router } from '../../../../node_modules/@angular/router';
import { DialogService } from '../../services/dialog.service';
import { MatDialog } from '../../../../node_modules/@angular/material';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';
import { PostInfo } from '../../models/PostInfo';
import { environment } from '../../../environments/environment';
import { AnalyticsService } from '../../services/analytics.service';
(window as any).jQuery = $;


@Component({
  selector: 'app-external-website',
  templateUrl: './external-website.component.html',
  styleUrls: ['./external-website.component.scss']
})
export class ExternalWebsiteComponent implements OnInit {
  usersCarousel = [];
  usersCarouselTry = [];
  desktop: boolean;
  logoSrc: string;
  onDestroy: Subject<void> = new Subject<void>();
  discoverPeopleArray = [];
  iOSdevice: boolean = false;
  private WindowSizeSubscription: Subscription;
  firstSlot: Observable<PostInfo>;
  secondSlot: Observable<PostInfo>;
  thirdSlot: Observable<PostInfo>;
  fourthSlot: Observable<PostInfo>;
  fifthSlot: Observable<PostInfo>;
  private bloggersPostsArray = environment.bloggersPosts;
  slots = [this.firstSlot, this.secondSlot, this.thirdSlot, this.fourthSlot, this.fifthSlot];
  constructor(private feedService: FeedService,
    private configService: ConfigService, private router: Router, private dialogService: DialogService, private dialog: MatDialog, private postService: PostService, private userService: UserService, private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.configService.setUserRegionFromLocale();
    this.feedService.discoverPeopleGeneral().pipe(takeUntil(this.onDestroy)).subscribe(res => {
      this.discoverPeopleArray = res;
      this.generateCarousel();
    });

    this.analyticsService.updatePage("Landing Page");


    let href = this.router.url;
    if (href.includes('/instagram')) {
      if (this.getMobileOperatingSystem()) {
        window.location.href = "https://apps.apple.com/app/followear/id1476265803";
      }
    }




    //set slots top position
    this.initSlots();

    this.WindowSizeSubscription = this.configService.windowSizeChanged
      .subscribe(
        value => {
          if (value.width >= 600) {
            this.desktop = true;
            this.logoSrc = "../../../assets/landing-logo.png";
          }

          if (value.width <= 600) {
            this.desktop = false;
            this.logoSrc = "../../../assets/fw_logo_pink.ico"
          }
        });
  }



  getMobileOperatingSystem() {
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      return true;
    } else {
      return false;
    }
  }

  initSlots() {
    let prevPage = "";
    let userID = 7;
    this.firstSlot = this.postService.getMobilePostInfo(this.bloggersPostsArray[0].userId, this.bloggersPostsArray[0].postId, userID, prevPage);
    this.secondSlot = this.postService.getMobilePostInfo(this.bloggersPostsArray[1].userId, this.bloggersPostsArray[1].postId, userID, prevPage);
    this.thirdSlot = this.postService.getMobilePostInfo(this.bloggersPostsArray[2].userId, this.bloggersPostsArray[2].postId, userID, prevPage);
    this.fourthSlot = this.postService.getMobilePostInfo(this.bloggersPostsArray[3].userId, this.bloggersPostsArray[3].postId, userID, prevPage);
    this.fifthSlot = this.postService.getMobilePostInfo(this.bloggersPostsArray[4].userId, this.bloggersPostsArray[4].postId, userID, prevPage);
  }

  generateCarousel() {
    let i;
    let j;
    let newUsersArray;
    for (i = 0; i < this.discoverPeopleArray.length; i++) {
      newUsersArray = [];
      for (j = 0; j < this.discoverPeopleArray.length; j++) {
        newUsersArray.push(this.discoverPeopleArray[(j + i) % this.discoverPeopleArray.length]);
      }
      this.usersCarousel.push(newUsersArray);
    }
  }

  getItemsDesktop(items) {
    var desktopItems = []
    for (var i = 0; i < 3 && i < items.length; i++) {
      desktopItems.push(items[i]);
    }
    return desktopItems;
  }

  loginPage(): void {
    if (this.desktop) {
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
    else {
      this.router.navigate(['/login']);
    }
  }

  registerPage() {
    if (this.desktop) {
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
    } else {
      this.router.navigate(['register']);
    }
  }

  explorePage() {
    this.router.navigate(['/general-explore']);
  }

  profilePage(slotNumber) {
    if (this.desktop) {
      this.router.navigate(['desktop-profile', slotNumber.userId]);
    } else {
      this.router.navigate(['profile', slotNumber.userId]);
    }
  }

  openProductPage(slotNumber): void {
    this.configService.setGeneralSession('product_id', slotNumber.postId);
    this.configService.setGeneralSession('user_id_post_id', slotNumber.userId);
    if (this.desktop) {
      this.dialogService.openDialog();
    } else {
      this.router.navigate(['product-page', slotNumber.postId]);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
  }

}
