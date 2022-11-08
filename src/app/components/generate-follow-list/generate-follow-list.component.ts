import { Component, OnInit, Input, Inject, OnDestroy, Optional } from '@angular/core';

import { Subject, Observable, fromEvent } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { takeUntil, map } from 'rxjs/operators';
import { LocationService } from '../../services/location.service';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { DialogService } from '../../services/dialog.service';
import { ErrorsService } from '../../services/errors.service';
import { NgxSpinnerService } from '../../../../node_modules/ngx-spinner';
import * as jquery from 'jquery';
import { ViewFollowListComponent } from '../view-follow-list/view-follow-list.component';

@Component({
  selector: 'app-generate-follow-list',
  templateUrl: './generate-follow-list.component.html',
  styleUrls: ['./generate-follow-list.component.css']
})
export class GenerateFollowListComponent implements OnInit, OnDestroy {
  @Input() postsToShow = [];
  @Input() dialogTitle: string;
  @Input() matDialogRef: MatDialogRef<ViewFollowListComponent>;
  @Input() userId: number;
  showSpinner: boolean = true;
  desktop: boolean;
  onDestroy: Subject<void> = new Subject<void>();
  followingUsersChanged: boolean = false;
  constructor(
    private userService: UserService,
    private dialogService: DialogService,
    private router: Router,
    private location: LocationService
  ) {
  }

  ngOnInit() {
    this.desktop = this.dialogService.desktop;
  }

  follow(item) {

    //if user is already following then unfollow
    if (item['post']['follows']) {
      this.userService.unFollow(item['post']['id']);
      item['post']['follows'] = false;
    } else {
      this.userService.follow(item['post']['id']);
      item['post']['follows'] = true;
    }
    this.followingUsersChanged = true;
  }

  userProfile(user) {
    if (this.desktop) {
      this.router.navigate(['desktop-profile', user['post']['id']]);
    } else {
      this.router.navigate(['profile', user['post']['id']]);
    }
    if (this.matDialogRef) {
      this.matDialogRef.close();
    }
  }

  closeModal() {
    this.matDialogRef.close();
  }

  goBackPage() {
    this.location.goBack();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
