import { Component, OnInit, HostListener } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user.service';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

import { PostService } from '../../services/post.service';

import { NgxMasonryOptions } from 'ngx-masonry';
import { ErrorsService } from '../../services/errors.service';
import { FeedReturnObject } from '../../models/FeedReturnObject';
import { FilteringDTO } from '../../models/FilteringDTO';
import { ConfigService } from '../../services/config.service';
import { DialogService } from '../../services/dialog.service';
import { Router } from '../../../../node_modules/@angular/router';
import { MessageService } from '../../services/message.service';
import * as jquery from 'jquery';
import { NgxSpinnerService } from '../../../../node_modules/ngx-spinner';
import { Title, Meta } from '@angular/platform-browser';
import { MatDialog } from '../../../../node_modules/@angular/material';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { Overlay } from '../../../../node_modules/@angular/cdk/overlay';
import { AnalyticsService } from '../../services/analytics.service';


@Component({
  selector: 'app-explore-feed-general',
  templateUrl: './explore-feed-general.component.html',
  styleUrls: ['./explore-feed-general.component.scss']
})
export class ExploreFeedGeneralComponent implements OnInit {
  posts = [];
  offset: number = 0;
  endOfFeed: boolean = false;
  loading: boolean = true;
  onDestroy: Subject<void> = new Subject<void>();
  desktop: boolean;
  windowWidth: number;
  showNoPostsMessage: boolean = false;
  prevScrollPos = window.pageYOffset;
  showPopup: boolean = true;
  productPageClicked: boolean = false;
  private feedSubsription: Subscription
  private baseApiUrl = environment.BASE_API_URL;
  private updateFeed: Subscription

  count = 0;
  public masonryOptions: NgxMasonryOptions = {
    transitionDuration: '0',
    horizontalOrder: true,
    gutter: 18,
    fitWidth: true
  };
  private WindowSizeSubscription: Subscription;
  constructor(
    private userService: UserService,
    private feedService: FeedService,
    private configService: ConfigService,
    private massageService: MessageService,
    private dialogService: DialogService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private overlay: Overlay,
    private titleService: Title,
    private dialog: MatDialog,
    private meta: Meta,
    private analyticsService: AnalyticsService
  ) {

  }

  ngOnInit() {
    this.productPageClicked = false;
    this.analyticsService.updatePage("General Explore Page");
    if (this.analyticsService.getPrevPage() != "Product Page") {
      this.analyticsService.reportGeneralExploreView();
    }

    this.titleService.setTitle('Explore Followear General');
    this.meta.addTag({ name: 'description', content: "Explore Followear! click here to see fashion items from your favorite stores" });
    this.meta.addTag({ name: 'robots', content: 'index, follow' });
    this.spinner.show();
    this.configService.setUserRegionFromLocale();
    this.updateFeed = this.feedService
      .getNewPosts().pipe(takeUntil(this.onDestroy)).subscribe(observablePosts => {
        observablePosts.subscribe((observablePosts: any) => {
          this.posts = this.posts.concat(observablePosts.newPosts);
          if (this.posts.length == 0) {
            this.showNoPostsMessage = true;
          } else {
            this.showNoPostsMessage = false;
          }
          this.spinner.hide();
        })
      });
    this.feedSubsription = this.massageService.getMessage().pipe(takeUntil(this.onDestroy)).subscribe(msg => {
      if (msg) {
        if (msg.msg == 'update-feed') {
          this.spinner.show();
          this.posts = [];
          this.feedService.updateGeneralExploreFeed();
        } if (msg.msg == "scroll up explore page") {
          window.scroll(0, 0);
        }
      }
    });

    this.WindowSizeSubscription = this.configService.windowSizeChanged.pipe(takeUntil(this.onDestroy))
      .subscribe(
        value => {
          if (value.width >= 600) {
            this.desktop = true;
          }

          if (value.width <= 600) {
            this.desktop = false;
            this.masonryOptions.gutter = 12;
            this.feedService.updateGeneralExploreFeed();
          }
          this.windowWidth = value.width;
        });
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
    let currScrollPos: number = window.pageYOffset;
    if (currScrollPos > 2000) {
      if (this.showPopup) {
        this.registerPage();
      }
    }
    else {
      this.dialog.closeAll();
      this.showPopup = true;
    }
  }

  registerPage(): void {
    this.showPopup = false;
    this.openLoginDialog();
  }

  openLoginDialog() {
    var pageWidth = this.desktop ? "420px" : "88vw";
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
      var pageWidth = this.desktop ? "420px" : "88vw";
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

  openDialog(post): void {

    this.configService.setGeneralSession('product_id', post.post.postId);
    this.configService.setGeneralSession('user_id_post_id', post.post.userId);
    if (this.desktop) {
      this.dialogService.openDialog({}, 1);
    } else {
      this.productPageClicked = true;
      this.router.navigate(['product-page', post.post.postId]);
    }
  }

  discoverPeople() {
    this.router.navigate(['feed-discover-people']);
  }

  public ngOnDestroy(): void {
    if (!this.productPageClicked) {
      this.analyticsService.reportGeneralExploreSessionEnd();
    }
    this.onDestroy.next();
  }

}
