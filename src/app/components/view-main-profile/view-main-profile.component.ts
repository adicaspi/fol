import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, pipe } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/User';
import * as jquery from 'jquery';


@Component({
  selector: 'app-view-main-profile',
  templateUrl: './view-main-profile.component.html',
  styleUrls: ['./view-main-profile.component.scss']
})
export class ViewMainProfileComponent implements OnInit {

  desktop = true;
  userId: number;
  masterId: number;
  userProfile = false;
  masterUser: User;
  user: User;
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
    this.masterId = this.userService.userId;
    console.log(this.masterId, "im master id");
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
