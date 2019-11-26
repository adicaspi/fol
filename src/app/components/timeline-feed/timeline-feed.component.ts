import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable, Subscription, of } from 'rxjs';
import { PostService } from '../../services/post.service';
import { NgxMasonryOptions } from 'ngx-masonry';
import { DialogService } from '../../services/dialog.service';
import { ConfigService } from '../../services/config.service';
import { GlobalVariable } from '../../../global';
import { Router } from '../../../../node_modules/@angular/router';
import { ErrorsService } from '../../services/errors.service';
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { BehaviorSubject } from 'rxjs';
import { map, tap, scan, mergeMap, throttleTime, filter } from 'rxjs/operators';

@Component({
  selector: 'app-timeline-feed',
  templateUrl: './timeline-feed.component.html',
  styleUrls: ['./timeline-feed.component.css']
})
export class TimelineFeedComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport, { static: false }) virtualScroll: CdkVirtualScrollViewport;
  id: number;
  posts: Array<any> = [];
  postsToShow = [];
  offset: number = 0;
  desktop: boolean = true;
  onDestroy: Subject<void> = new Subject<void>();
  error: string;
  endOfFeed = false;
  private feedSubsription: Subscription
  newoffset = new BehaviorSubject(null);
  infinite: Observable<any[]>;

  private baseApiUrl = GlobalVariable.BASE_API_URL;
  private subscription;
  private anyErrors: boolean;
  private finished: boolean;

  constructor(
    private userService: UserService,
    private feedService: FeedService,
    private postService: PostService,
    private dialogService: DialogService,
    private configService: ConfigService,
    private router: Router,
    private errorsService: ErrorsService,
    private scrollDispatcher: ScrollDispatcher

  ) {
  }

  ngOnInit() {
    this.id = this.userService.getCurrentUser();
    this.generateTimelineFeed(this.offset, this.id);
    this.subscription = this.configService.windowSizeChanged.pipe(takeUntil(this.onDestroy))
      .subscribe(
        value => {
          if (value.width <= 900) {
          }
          if (value.width <= 600) {
            this.desktop = false;
          }
        }),
      error => this.anyErrors = true,
      () => this.finished = true

    this.feedSubsription = this.errorsService.getMessage().subscribe(msg => {
      if (msg.error == 'update-timelinefeed') {
        this.postsToShow = [];
        this.offset = 0;
        this.generateTimelineFeed(this.offset, this.id);
      }
    });
  }

  // ngAfterViewInit(): void {
  //   console.log("in after view");
  //   this.scrollDispatcher.scrolled().pipe(
  //     filter(event => this.virtualScroll.getRenderedRange().end === this.virtualScroll.getDataLength())
  //   ).subscribe(event => {
  //     console.log('new result append', this.offset);
  //     if (!this.endOfFeed) {
  //       this.generateTimelineFeed(this.offset, this.id);
  //     }
  //   })
  // }

  private processData = posts => {
    if (this.offset == posts['newOffset']) {
      return;
    }
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
    console.log("im posts to tshow", this.postsToShow);
  };


  // processData(posts): Observable<any> {
  //   let newPosts = [];
  //   if (this.offset == posts['newOffset']) {
  //     return;
  //   }
  //   this.offset = posts['newOffset'];
  //   posts['feedPosts'].forEach(post => {
  //     let baseAPI = this.baseApiUrl + '/image?s3key=';
  //     let postObject = {
  //       post: post,
  //       postImgSrc: baseAPI + post.postImageAddr,
  //       profileImgSrc: baseAPI + post.userProfileImageAddr
  //     };

  //     newPosts.push(postObject);

  //   });
  //   console.log("in procress newpossts", newPosts);
  //   return of(newPosts);
  // };

  // generateTimelineFeed(offset: number, id: number) {
  //   console.log("in gen time");
  //   this.feedService
  //     .getTimeLineFeed(offset, id)
  //     .pipe(takeUntil(this.onDestroy))
  //     .subscribe(posts => {
  //       if (posts == null) {
  //         this.endOfFeed = true;
  //       }
  //       else {
  //         this.processData(posts).subscribe(res => {
  //           this.postsToShow = this.postsToShow.concat(res)
  //           console.log("im posts to show", this.postsToShow);
  //         })
  //       }
  //     });
  // }

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
    this.postService.userPostUserId = post.post.userId;
    this.postService.userPostPostId = post.post.postId;
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
