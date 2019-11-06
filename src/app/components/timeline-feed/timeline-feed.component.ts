import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { PostService } from '../../services/post.service';
import { NgxMasonryOptions } from 'ngx-masonry';
import { DialogService } from '../../services/dialog.service';
import { ConfigService } from '../../services/config.service';
import { GlobalVariable } from '../../../global';
import { Router } from '../../../../node_modules/@angular/router';
import { ErrorsService } from '../../services/errors.service';

@Component({
  selector: 'app-timeline-feed',
  templateUrl: './timeline-feed.component.html',
  styleUrls: ['./timeline-feed.component.css']
})
export class TimelineFeedComponent implements OnInit {
  id: number;
  posts: Array<any> = [];
  postsToShow = [];
  offset: number = 0;
  desktop: boolean = true;
  onDestroy: Subject<void> = new Subject<void>();
  error: string;

  private baseApiUrl = GlobalVariable.BASE_API_URL;
  private subscription;
  private anyErrors: boolean;
  private finished: boolean;

  public masonryOptions: NgxMasonryOptions = {
    transitionDuration: '0',
    horizontalOrder: true,
    fitWidth: true,
    gutter: 39
  };

  constructor(
    private userService: UserService,
    private feedService: FeedService,
    private postService: PostService,
    private dialogService: DialogService,
    private configService: ConfigService,
    private router: Router,

  ) { }

  ngOnInit() {

    this.id = this.userService.getCurrentUser();
    //this.id = 655;
    this.generateTimelineFeed(0, this.id);
    this.subscription = this.configService.windowSizeChanged.pipe(takeUntil(this.onDestroy))
      .subscribe(
        value => {
          if (value.width <= 900) {
            // this.masonryOptions.gutter = 60;
            this.masonryOptions.fitWidth = true;
          }
          if (value.width <= 600) {
            this.masonryOptions.horizontalOrder = false;
            this.desktop = false;
            this.masonryOptions.gutter = 100;
          }
        }),
      error => this.anyErrors = true,
      () => this.finished = true

  }

  private processData = posts => {
    this.offset = posts['newOffset'];
    posts['feedPosts'].forEach(post => {
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
    // if (this.deviceService.isDesktop()) {
    //this.dialogService.openModalWindow(ProductPageComponent, post);
    this.postService.userPost = post;
    if (this.desktop) {
      this.dialogService.openDialog();
    } else {
      //this.dialogService.userPost = post;
      this.dialogService.directingPage = 'feed';
      this.router.navigate(['product-page']);
    }
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }

  profilePage(post) {
    this.router.navigate(['profile', post['post']['userId']]);
  }
}
