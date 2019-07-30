import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FeedService } from '../../services/feed.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { PostService } from '../../services/post.service';
import { NgxMasonryOptions } from 'ngx-masonry';
import { DialogService } from '../../services/dialog.service';
import { ProductPageComponent } from '../product-page/product-page.component';
import { GlobalVariable } from '../../../global';
import { Router } from '../../../../node_modules/@angular/router';
import { DeviceDetectorService } from '../../../../node_modules/ngx-device-detector';

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

  public masonryOptions: NgxMasonryOptions = {
    transitionDuration: '0',
    horizontalOrder: true,
    gutter: 39
  };

  constructor(
    private userService: UserService,
    private feedService: FeedService,
    private dialogService: DialogService,
    private deviceService: DeviceDetectorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.userService.getCurrentUser();
    //this.id = 655;
    this.generateTimelineFeed(0, this.id);
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
      this.dialogService.directingPage = 'feed';
      this.router.navigate(['product-page']);
    }
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }

  profilePgae(post) {
    this.router.navigate(['profile', post['post']['userId']]);
  }
}
