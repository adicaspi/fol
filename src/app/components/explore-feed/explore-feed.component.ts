import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ProductPageComponent } from '../product-page/product-page.component';

import { NgxMasonryOptions } from 'ngx-masonry';
import { GlobalVariable } from '../../../global';
import { DeviceDetectorService } from '../../../../node_modules/ngx-device-detector';
import { DialogService } from '../../services/dialog.service';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-explore-feed',
  templateUrl: './explore-feed.component.html',
  styleUrls: ['./explore-feed.component.css']
})
export class ExploreFeedComponent implements OnInit {
  id: number;
  posts: Array<any> = [];
  postsToShow = [];
  offset: number = 0;
  onDestroy: Subject<void> = new Subject<void>();
  private baseApiUrl = GlobalVariable.BASE_API_URL;

  count = 0;
  public masonryOptions: NgxMasonryOptions = {
    transitionDuration: '0',
    horizontalOrder: true,
    gutter: 10
  };
  constructor(
    private userService: UserService,
    private feedService: FeedService,
    private deviceService: DeviceDetectorService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.userService.userId;
    // explore of unsigned user (user id = 0)

    if (!this.id) {
      this.generateTimelineFeed(0, 0);
    } else {
      //this.id = 655; //DELETE ID
      this.generateTimelineFeed(0, this.id);
    }
  }

  private processData = posts => {
    this.posts = this.posts.concat(posts);
    posts.forEach(post => {
      let baseAPI = this.baseApiUrl + '/image?s3key=';
      let postObject = {
        post: post,
        postImgSrc: baseAPI + post.postImageAddr,
        profileImgSrc: baseAPI + post.userProfileImageAddr
      };
      this.postsToShow.push(postObject);
    });
  };

  generateTimelineFeed(offset: number, id: number) {
    this.feedService
      .getTimeLineFeed(offset, id)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(this.processData);
  }
  fetchImages() {
    this.generateTimelineFeed(this.offset, this.id);
  }

  openDialog(post): void {
    if (this.deviceService.isDesktop()) {
      this.dialogService.openDialog(ProductPageComponent, post);
    } else {
      this.dialogService.userPost = post;
      this.dialogService.directingPage = 'explore';
      this.router.navigate(['product-page']);
    }
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }
}
