import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/User';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit, OnDestroy {
  desktop = true;
  userId: number;
  masterId: number;
  userProfile = false;
  masterUser: User;
  private anyErrors: boolean;
  private finished: boolean;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private feedService: FeedService,
    public userService: UserService,
    public activatedRoute: ActivatedRoute
  ) {
    this.userId = this.userService.userId;
    const routeParams = this.activatedRoute.snapshot.params;
    this.masterId = parseInt(routeParams.id, 10);

    if (this.userId === this.masterId) {
      this.userProfile = true;
    } else {
      this.userService.getUserDetails(this.masterId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(res => {
          this.masterUser = res;
        });
    }
  }

  ngOnInit() {
    this.feedService.currentLoadedFeedComponent = 'profile';
    this.configService.windowSizeChanged
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        value => this.desktop = value.width > 600,
        () => this.anyErrors = true,
        () => this.finished = true
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
