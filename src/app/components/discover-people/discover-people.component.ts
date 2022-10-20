import { Component, OnInit, Input } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject, Subscription } from '../../../../node_modules/rxjs';
import { ConfigService } from '../../services/config.service';
import { DialogService } from '../../services/dialog.service';
import { Router } from '../../../../node_modules/@angular/router';
import { UserService } from '../../services/user.service';
import { ScrollHelperService } from '../../services/scroll-helper.service';
import { MatDialog } from '../../../../node_modules/@angular/material';
import { Overlay } from '../../../../node_modules/@angular/cdk/overlay';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { Title, Meta } from '../../../../node_modules/@angular/platform-browser';
import { AnalyticsService } from '../../services/analytics.service';


@Component({
  selector: 'app-discover-people',
  templateUrl: './discover-people.component.html',
  styleUrls: ['./discover-people.component.scss']
})
export class DiscoverPeopleComponent implements OnInit {
  @Input() discoverPeopleArray;
  desktop: boolean = true;
  onDestroy: Subject<void> = new Subject<void>();
  private WindowSizeSubscription: Subscription;
  registeredUser: boolean = false;



  constructor(private feedService: FeedService,
    private configService: ConfigService,
    private dialogService: DialogService,
    private router: Router,
    private userService: UserService,
    private overlay: Overlay,
    private dialog: MatDialog,
    private scrollHelperService: ScrollHelperService,
    private titleService: Title,
    private meta: Meta,
    private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.analyticsService.reportDiscoverPeopleSessionStart();
    this.analyticsService.updatePage("Discover");
    if (this.userService.userId) {
      this.registeredUser = true;
    }
    this.titleService.setTitle('Discover People');
    this.meta.addTag({ name: 'robots', content: 'noimageindex, noarchive' });

    this.WindowSizeSubscription = this.configService.windowSizeChanged
      .subscribe(
        value => {
          if (value.width > 600) {
            this.desktop = true;
          }

          if (value.width <= 600) {
            this.desktop = false;
            this.scrollHelperService.runDataLoaded();
          }
        });
  }

  getItemsDesktop(items) {
    var desktopItems = []
    for (var i = 0; i < 3 && i < items.length; i++) {
      desktopItems.push(items[i]);
    }
    return desktopItems;
  }

  openDialog(item, postId): void {
    this.configService.setGeneralSession('product_id', postId);
    this.configService.setGeneralSession('user_id_post_id', item.userId);
    if (this.desktop) {
      this.dialogService.openDialog();
    } else {
      this.router.navigate(['product-page', postId]);
    }
  }

  follow(item) {
    if (this.registeredUser) {
      if (item.follows) {
        this.userService.unFollow(item.userId);
        item.follows = false;
      }
      else {
        this.userService.follow(item.userId);
        item.follows = true;
      }
    }
    else {
      this.openLoginDialog();
    }
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


  profilePage(item) {
    if (this.desktop) {
      this.router.navigate([]).then(result => { window.open('profile/' + item.userId, '_blank'); });
    }
    else {
      this.router.navigate(['profile', item.userId]);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.WindowSizeSubscription.unsubscribe();
    this.analyticsService.reportDiscoverPeopleSessionStart();

  }

}
