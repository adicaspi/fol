import { Component, OnInit, Input, HostListener } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute, Router, Routes, ParamMap } from '@angular/router';
import { Subject, Observer, Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PostService } from '../../services/post.service';
import { DialogService } from '../../services/dialog.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ConfigService } from '../../services/config.service';
import { ScrollHelperService } from '../../services/scroll-helper.service';
import { ProductPageMobileComponent } from '../product-page-mobile/product-page-mobile.component';
import { ErrorsService } from '../../services/errors.service';
import { FeedReturnObject } from '../../models/FeedReturnObject';
import { FilteringDTO } from '../../models/FilteringDTO';
import { MessageService } from '../../services/message.service';
import { NgxSpinnerService } from '../../../../node_modules/ngx-spinner';
import { UserService } from '../../services/user.service';
import * as jquery from 'jquery';
import * as $ from 'jquery';
import { User } from '../../models/User';
import { RegisterComponent } from '../register/register.component';
import { MatDialog } from '../../../../node_modules/@angular/material';
import { Overlay } from '../../../../node_modules/@angular/cdk/overlay';
import { LoginComponent } from '../login/login.component';
import { Title, Meta } from '../../../../node_modules/@angular/platform-browser';
import { AnalyticsService } from '../../services/analytics.service';




@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.component.html',
  styleUrls: ['./user-feed.component.scss']
})
export class UserFeedComponent implements OnInit {
  //@Input() user: User;
  posts = [];
  offset: number = 0;
  desktop: boolean = true;
  searchedTouched: boolean = false;
  id = 0;
  prevId = 0;
  deviceInfo = null;
  loading: boolean = true;
  endOfFeed: boolean = false;
  showNoPostsMessage: boolean = false;
  userProfile: boolean = false;
  scrollPageToTop: boolean = false;
  user: Observable<User>;
  showPopup: boolean = true;
  registeredUser: boolean = false;
  productPageClicked: boolean = false;
  private baseApiUrl = environment.BASE_API_URL;
  private WindowSizeSubscription: Subscription
  private feedSubscription: Subscription
  private updateFeed: Subscription
  private anyErrors: boolean;
  private finished: boolean;
  savedTab: boolean = false;
  userFeedTab: boolean = true;
  userObject: User



  routes: Routes = [
    { path: 'product-page', component: ProductPageMobileComponent }
  ];

  onDestroy: Subject<void> = new Subject<void>();
  error: string = "";

  constructor(
    private feedService: FeedService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private deviceService: DeviceDetectorService,
    private router: Router,
    private configService: ConfigService,
    private postService: PostService,
    private errorsService: ErrorsService,
    private scrollHelperService: ScrollHelperService,
    private massageService: MessageService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private titleService: Title,
    private meta: Meta,
    private analyticsService: AnalyticsService

  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    // if (this.userService.userId) {
    //   this.registeredUser = true;
    // }

    this.productPageClicked = false;
    this.titleService.setTitle('User Profile Feed');
    this.meta.addTag({ name: 'robots', content: 'noimageindex, noarchive' });
    jquery(".scroll-bar-container").css("margin", "-6px 0px -6px");
    this.spinner.show();
    this.updateFeed = this.feedService
      .getNewPosts().pipe(takeUntil(this.onDestroy)).subscribe(observablePosts => {
        observablePosts.pipe(takeUntil(this.onDestroy)).subscribe((observablePosts: any) => {
          if (observablePosts == "endOfFeed") {
            this.endOfFeed = true;
            if (this.posts.length == 0) {
              this.showNoPostsMessage = true;
            }
          }
          else {

            this.showNoPostsMessage = false;
            this.posts = this.posts.concat(observablePosts.newPosts);
            this.offset = observablePosts.offset;
            if (!this.scrollPageToTop) {
              this.scrollHelperService.runDataLoaded();
            }
          }
          this.spinner.hide();
        })
      });
    this.feedSubscription = this.massageService.getMessage().pipe(takeUntil(this.onDestroy)).subscribe(msg => {
      if (msg) {
        if (msg.msg == 'update-feed') {
          this.spinner.show();
          this.posts = [];
          this.offset = 0;
          this.scrollPageToTop = true;
          //this.getActivatedRoute();
          //this.feedService.updateProfileFeed(this.id, this.offset);
          this.feedService.updateUserFeed(this.id, this.offset);
        }
        if (msg.msg == "scroll up user page") {
          window.scroll(0, 0);
        }
      }
    });
    this.WindowSizeSubscription = this.configService.windowSizeChanged.pipe(takeUntil(this.onDestroy)).subscribe(
      value => {
        if (value.width <= 600) {
          this.desktop = false;
        } else {
          this.desktop = true;
        }
      }, error => this.anyErrors = true,
      () => this.finished = true);
    this.getActivatedRoute();

  }

  loadUser(id) {
    this.userService.getUserProfileInfo(id).pipe(takeUntil(this.onDestroy)).subscribe(user => {
      this.userObject = new User(user);
    }, err => {
      console.log(err);
      //closeLoadingBar();
    },
      () => {
        //do whatever you want
        this.callMixPanel();
      }

    );
  }

  callMixPanel() {
    if (this.userService.getCurrentUser() == this.id) {
      this.analyticsService.reportMyProfileSessionStart();
      this.userService.updatePage("my profile");
      if (this.userService.getPrevPage() != "product") {
        this.analyticsService.reportMyProfileView(this.userObject.id, this.userObject.username, this.userObject.fullName, this.userObject.description);

      }
    } else {
      this.userService.updatePage("user profile");
      if (this.userService.getPrevPage() != "product") {
        this.analyticsService.reportUserProfileView(this.userObject.id, this.userService.getCurrentUser(), this.userObject.username, this.userObject.fullName, this.userObject.description);
        this.analyticsService.reportUserProfileSessionStart();
      }

    }

  }

  getActivatedRoute() {
    this.activatedRoute.params
      .pipe(takeUntil(this.onDestroy))
      .subscribe(params => {
        this.id = +params['id'];
        this.user = this.userService.getUserProfileInfo(this.id);
        this.loadUser(this.id);
        if (this.userService.getCurrentUser() == this.id) {
          this.userProfile = true;
        } else {
          this.userProfile = false;
        }
        if (!this.desktop) {
          this.feedService.updateProfileFeed(this.id, this.offset);
        }
      })
  }

  registerPage(): void {
    this.showPopup = false;
    this.openLoginDialog();
  }

  openPostOrLogin(post) {
    // // if (this.registeredUser) {
    this.openDialog(post)
    // // } else {
    // this.openLoginDialog();
    // //  }

  }

  openLoginDialog() {
    this.configService.setGeneralSession('profile', this.id.toString());
    var pageWidth = this.desktop ? "420px" : "92vw";
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    const config = {
      scrollStrategy: scrollStrategy,
      width: pageWidth,
      height: "unset",
      data: {
        showCloseButton: false
      }
    }

    const dialogRef = this.dialog.open(LoginComponent, config);
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res => {
      if (res == "register") {
        this.openRegisterDialog();
      }

    })
  }

  openRegisterDialog() {
    this.configService.setGeneralSession('profile', this.id.toString());
    if (this.desktop) {
      var pageWidth = this.desktop ? "420px" : "92vw";
      const scrollStrategy = this.overlay.scrollStrategies.reposition();
      const config = {
        scrollStrategy: scrollStrategy,
        width: pageWidth,
        height: "unset",
        data: {
          showCloseButton: false
        }
      }

      const registerDialogRef = this.dialog.open(RegisterComponent, config);
      registerDialogRef.disableClose = true;

      registerDialogRef.afterClosed().subscribe(res => {
        if (res == "login") {
          this.openLoginDialog();
        }
      })
    } else {
      this.router.navigate(['register']);
    }
  }


  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    if (!this.userService.userId) {
      let currScrollPos: number = window.pageYOffset;
      if (currScrollPos > 2000) {
        if (this.showPopup) {
          this.registerPage();
        }
      }
      else {
        this.dialog.closeAll();
        this.configService.removeItem('profile');
        this.showPopup = true;
      }
    }
  }

  postSalePrice(post) {
    return post.post.salePrice;
  }

  getSavedFeed() {
    this.savedTab = true;
    this.userFeedTab = false;
    this.posts = [];
    this.offset = 0;
    this.scrollPageToTop = true;
    this.feedService.updateSavedFeed(this.id, this.offset);
  }

  getUserFeed() {
    this.savedTab = false;
    this.userFeedTab = true;
    this.posts = [];
    this.offset = 0;
    this.scrollPageToTop = true;
    //  if (!this.desktop) {
    this.feedService.updateUserFeed(this.id, this.offset);
    // }
  }


  onScroll() {
    if (!this.endOfFeed) {
      // this.feedService.updateProfileFeed(this.id, this.offset);
      if (this.userFeedTab) {
        this.feedService.updateUserFeed(this.id, this.offset);
        this.spinner.show();
      } else {
        this.feedService.updateSavedFeed(this.id, this.offset);
      }
    } else {
      this.spinner.hide();
    }
  }

  openDialog(post): void {
    this.configService.setGeneralSession('product_id', post.post.postId);
    this.configService.setGeneralSession('user_id_post_id', post.post.userId);
    this.postService.userPost = post;
    if (this.desktop) {
      this.dialogService.openDialog();
    } else {
      this.productPageClicked = true;
      this.router.navigate(['product-page', post.post.postId]);
    }
  }


  ngOnDestroy() {
    this.WindowSizeSubscription.unsubscribe();
    this.onDestroy.next();
    this.onDestroy.complete();
    this.feedSubscription.unsubscribe();
    this.updateFeed.unsubscribe();
    if (!this.productPageClicked) {
      if (this.userProfile) {

        this.analyticsService.reportMyProfileSessionEnd(this.userObject.id, this.userObject.username, this.userObject.fullName, this.userObject.description);

      }
      else {
        this.analyticsService.reportUserProfileSessionEnd(this.userObject.id, this.userService.getCurrentUser(), this.userObject.username, this.userObject.fullName, this.userObject.description);

      }
    }
  }

}
