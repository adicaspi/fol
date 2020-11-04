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
  private WindowSizeSubscription: Subscription;
  // firstSlot = { username: "", fullName: "", userId: 173, postId: 10, profileImg: "", postImg: "../../../assets/external_website_post.png" };
  // secondSlot = { username: "", fullName: "", userId: 157, postId: 10, profileImg: "", postImg: "../../../assets/external_website_post.png" };
  // thirdSlot = { username: "", fullName: "", userId: 155, postId: 840, profileImg: "", postImg: "" };
  // fourthSlot = { username: "", fullName: "", userId: 104, postId: 553, profileImg: "", postImg: "" };
  // fifthSlot = { username: "", fullName: "", userId: 168, postId: 1216, profileImg: "", postImg: "" };
  // firstSlot = { username: "", fullName: "", userId: 65, postId: 341, profileImg: "", postImg: "" };
  // secondSlot = { username: "", fullName: "", userId: 2, postId: 482, profileImg: "", postImg: "" };
  // thirdSlot = { username: "", fullName: "", userId: 7, postId: 301, profileImg: "", postImg: "" };
  // fourthSlot = { username: "", fullName: "", userId: 92, postId: 262, profileImg: "", postImg: "" };
  // fifthSlot = { username: "", fullName: "", userId: 89, postId: 254, profileImg: "", postImg: "" };
  firstSlot: Observable<PostInfo>;
  secondSlot: Observable<PostInfo>;
  thirdSlot: Observable<PostInfo>;
  fourthSlot: Observable<PostInfo>;
  fifthSlot: Observable<PostInfo>;
  slots = [this.firstSlot, this.secondSlot, this.thirdSlot, this.fourthSlot, this.fifthSlot];
  constructor(private feedService: FeedService,
    private configService: ConfigService, private router: Router, private dialogService: DialogService, private dialog: MatDialog, private postService: PostService) { }

  ngOnInit() {
    this.feedService.discoverPeopleGeneral().pipe(takeUntil(this.onDestroy)).subscribe(res => {
      this.discoverPeopleArray = res;
      this.generateCarousel();
    });

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
            this.logoSrc = "../../../assets/fw_logo_pink.png"
          }
        });
  }

  initSlots() {

    this.firstSlot = this.postService.getMobilePostInfo(65, 341);
    this.secondSlot = this.postService.getMobilePostInfo(2, 482);
    this.thirdSlot = this.postService.getMobilePostInfo(7, 301);
    this.fourthSlot = this.postService.getMobilePostInfo(92, 262);
    this.fifthSlot = this.postService.getMobilePostInfo(89, 254);
    // var slot2 = $(".card-wrapper:nth-child(2) .user-post img");
    // var slot3 = $(".card-wrapper:nth-child(3)");
    // var slot4 = $(".card-wrapper:nth-child(4)");
    // var slot5 = $(".card-wrapper:nth-child(5)");
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
    this.router.navigate(['/explore']);
  }

  profilePage(slotNumber) {
    this.router.navigate(['profile', slotNumber.userId]);
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
