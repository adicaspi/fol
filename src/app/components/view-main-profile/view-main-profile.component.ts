import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, pipe } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute, Router } from '@angular/router';
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
    public activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    const routeParams = this.activatedRoute.snapshot.params;
    this.masterId = parseInt(routeParams.id);
    this.configService.windowSizeChanged
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        value => {
          if (value.width > 600) {
            this.desktop = true;
          } else {
            this.router.navigate(['profile', this.masterId]);
            this.desktop = false;
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
