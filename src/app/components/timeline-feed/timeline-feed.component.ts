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
  onDestroy: Subject<void> = new Subject<void>();
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  private subscription;
  private anyErrors: boolean;
  private finished: boolean;

  public masonryOptions: NgxMasonryOptions = {
    transitionDuration: '0',
    horizontalOrder: true,
    gutter: 39
  };

  constructor(
    private userService: UserService,
    private feedService: FeedService,
    private postService: PostService,
    private dialogService: DialogService,
    private configService: ConfigService,
    private router: Router
  ) { }

  ngOnInit() {
    this.id = this.userService.getCurrentUser();
    this.id = 655;
    this.generateTimelineFeed(0, this.id);
    this.subscription = this.configService.windowSizeChanged.subscribe(
      value => {
        if (value.width <= 900) {
          this.masonryOptions.gutter = 26;
        }
      }),
      error => this.anyErrors = true,
      () => this.finished = true

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
    //this.dialogService.userPost = post;
    this.postService.userPost = post;
    //this.dialogService.openModalWindow(ProductPageComponent, post);
    this.dialogService.openDialog();
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }

  profilePgae(post) {
    this.router.navigate(['profile', post['post']['userId']]);
  }
}
