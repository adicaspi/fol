import { Component, OnInit } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject, Subscription } from '../../../../node_modules/rxjs';
import { ConfigService } from '../../services/config.service';
import { DialogService } from '../../services/dialog.service';
import { Router } from '../../../../node_modules/@angular/router';
import { UserService } from '../../services/user.service';
import { LocationService } from '../../services/location.service';


@Component({
  selector: 'app-discvoer-people-user',
  templateUrl: './discvoer-people-user.component.html',
  styleUrls: ['./discvoer-people-user.component.scss']
})
export class DiscvoerPeopleUserComponent implements OnInit {
  discoverPeopleArray = [];
  desktop: boolean = true;
  onDestroy: Subject<void> = new Subject<void>();
  private WindowSizeSubscription: Subscription;

  constructor(private feedService: FeedService,
    private configService: ConfigService,
    private dialogService: DialogService,
    private router: Router,
    private location: LocationService,
    private userService: UserService) { }

  ngOnInit() {
    this.userService.discoverPeopleUser().pipe(takeUntil(this.onDestroy)).subscribe(res => {
      this.discoverPeopleArray = res;
    })
    this.WindowSizeSubscription = this.configService.windowSizeChanged
      .subscribe(
        value => {
          if (value.width >= 600) {
            this.desktop = true;
          }

          if (value.width <= 600) {
            this.desktop = false;
          }
        });
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
    this.userService.follow(item.userId);
  }

  profilePage(item) {
    this.router.navigate(['profile', item.userId]);
  }

  goBackPage() {
    this.location.goBack();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.WindowSizeSubscription.unsubscribe();
  }
}