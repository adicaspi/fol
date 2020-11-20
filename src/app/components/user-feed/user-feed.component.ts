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
  private baseApiUrl = environment.BASE_API_URL;
  private WindowSizeSubscription: Subscription
  private feedSubscription: Subscription
  private updateFeed: Subscription
  private anyErrors: boolean;
  private finished: boolean;


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
    private overlay: Overlay

  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.WindowSizeSubscription = this.configService.windowSizeChanged.subscribe(
      value => {
        if (value.width > 600) {
          this.desktop = true;
        }
        if (value.width <= 600) {
          this.desktop = false;
        }
      });
  }

  ngOnInit() {
    this.spinner.show();
    jquery(".scroll-bar-container").css("margin", "-6px 0px -6px");
    this.feedService.feedFilteringDTO = new FilteringDTO();
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
          this.feedService.updateUserFeed(this.id, this.offset);
        }
      }
    });
    this.getActivatedRoute();
  }

  getActivatedRoute() {
    this.activatedRoute.params
      .pipe(takeUntil(this.onDestroy))
      .subscribe(params => {
        this.id = +params['id'];
        if (this.userService.getCurrentUser() == this.id) {
          this.userProfile = true;
        }
        else {
          this.user = this.userService.getUserProfileInfo(this.id);
        }
        this.feedService.updateUserFeed(this.id, this.offset);
      })
  }

  registerPage(): void {
    this.showPopup = false;
    this.openLoginDialog();
  }

  openLoginDialog() {
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
      if (currScrollPos > 1000) {
        if (this.showPopup) {
          this.registerPage();
        }
      }
      else {
        if (this.desktop) {
          this.dialog.closeAll();
          this.showPopup = true;
        }
      }
    }
  }

  postSalePrice(post) {
    return post.post.salePrice;
  }

  onScroll() {
    if (!this.endOfFeed) {
      this.feedService.updateUserFeed(this.id, this.offset);
      this.spinner.show();

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
      this.router.navigate(['product-page', post.post.postId]);
    }
  }


  public ngOnDestroy(): void {
    this.WindowSizeSubscription.unsubscribe();
    this.onDestroy.next();
    this.onDestroy.complete();
    this.feedSubscription.unsubscribe();
    this.updateFeed.unsubscribe();
  }
}
