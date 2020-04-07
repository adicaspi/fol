import { Component, OnInit, Input } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject, Subscription } from '../../../../node_modules/rxjs';
import { ConfigService } from '../../services/config.service';
import { DialogService } from '../../services/dialog.service';
import { Router } from '../../../../node_modules/@angular/router';
import { UserService } from '../../services/user.service';
import { ScrollHelperService } from '../../services/scroll-helper.service';


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

  constructor(private feedService: FeedService,
    private configService: ConfigService,
    private dialogService: DialogService,
    private router: Router,
    private userService: UserService,
    private scrollHelperService: ScrollHelperService, ) { }

  ngOnInit() {
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
    if (item.follows) {
      this.userService.unFollow(item.userId);
      item.follows = false;
    }
    else {
      this.userService.follow(item.userId);
      item.follows = true;
    }
  }

  profilePage(item) {
    this.router.navigate([]).then(result => { window.open('profile/' + item.userId, '_blank'); });;
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.WindowSizeSubscription.unsubscribe();
  }

}
