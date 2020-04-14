import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/User';
import * as jquery from 'jquery';


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
  user: Observable<User>;
  private anyErrors: boolean;
  private finished: boolean;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private configService: ConfigService,
    private feedService: FeedService,
    public userService: UserService,
    public activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    const routeParams = this.activatedRoute.snapshot.params;
    this.masterId = parseInt(routeParams.id);
    this.updateUser(this.masterId);
    this.configService.windowSizeChanged
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        value => this.desktop = value.width > 600,
        () => this.anyErrors = true,
        () => this.finished = true
      );
  }

  updateUser(id) {
    this.user = this.userService.getUserProfileInfo(id);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
