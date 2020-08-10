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
    private meta: Meta
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Explore Followear');
    this.meta.addTag({ name: 'description', content: "Explore Followear! click here to see fashion items from your favorite stores" });
    this.meta.addTag({ name: 'robots', content: 'index, follow' });
    this.spinner.show();
    this.feedService.feedFilteringDTO = new FilteringDTO();
    this.updateFeed = this.feedService
      .getNewPosts().subscribe(observablePosts => {
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
    this.feedService.updateGeneralExploreFeed();
    this.feedSubsription = this.massageService.getMessage().subscribe(msg => {
      if (msg) {
        if (msg.msg == 'update-feed') {
          this.spinner.show();
          this.posts = [];
          this.feedService.updateGeneralExploreFeed();
        }
      }
    });

    this.WindowSizeSubscription = this.configService.windowSizeChanged
      .subscribe(
        value => {
          if (value.width >= 600) {
            this.desktop = true;
          }

          if (value.width <= 600) {
            this.desktop = false;
            this.masonryOptions.gutter = 12;
          }
          this.windowWidth = value.width;
        });
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandler(event) {
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

  registerPage(): void {
    this.showPopup = false;
    this.openLoginDialog();
  }

  openLoginDialog() {
    var pageWidth = this.desktop ? "400px" : "92vw";
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    const config = {
      scrollStrategy: scrollStrategy,
      width: pageWidth,
      height: "100% - 40px",
      data: {
        showCloseButton: false
      }
    }

    const dialogRef = this.dialog.open(LoginComponent, config);
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if (res == "register") {
        this.openRegisterDialog();
      }

    })
  }

  openRegisterDialog() {
    var pageWidth = this.desktop ? "400px" : "92vw";
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    const config = {
      scrollStrategy: scrollStrategy,
      width: pageWidth,
      height: "100% - 40px",
      data: {
        showCloseButton: false
      }
    }

    const registerDialogRef = this.dialog.open(RegisterComponent, config);
    registerDialogRef.disableClose = true;

    registerDialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if (res == "login") {
        this.openLoginDialog();
      }
    })
  }

  openDialog(post): void {
    this.configService.setGeneralSession('product_id', post.post.postId);
    this.configService.setGeneralSession('user_id_post_id', post.post.userId);
    if (this.desktop) {
      this.dialogService.openDialog();
    } else {
      this.router.navigate(['product-page', post.post.postId]);
    }
  }

  discoverPeople() {
    this.router.navigate(['feed-discover-people']);
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
    this.feedSubsription.unsubscribe();
    this.WindowSizeSubscription.unsubscribe();
  }

}
