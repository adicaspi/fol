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
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit, OnDestroy {
  desktop = true;
  //desktop: Observable<any>;
  userId: number;
  masterId: number;
  userProfile = false;
  masterUser: User;
  user: User;
  registeredUser: boolean = false;
  private anyErrors: boolean;
  private finished: boolean;
  onDestroy: Subject<void> = new Subject<void>();
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

    //const routeParams = this.activatedRoute.snapshot.params;
    //this.masterId = parseInt(routeParams.id);
    if (this.userService.userId) {
      this.registeredUser = true;
    }
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.onDestroy))
      .subscribe((params) => {
        this.masterId = +params.get('id');
      });
    this.checkWindowSize(this.masterId);
  }

  checkWindowSize(id) {
    this.configService.windowSizeChanged
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        value => {
          if (value.width > 600) {
            this.desktop = true;
            this.router.navigate(['desktop-profile', id]);
          } else {
            this.desktop = false;
          }
        }
      );
  }

  updateUser(id) {
    this.userService.getUserProfileInfo(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      this.user = res
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
