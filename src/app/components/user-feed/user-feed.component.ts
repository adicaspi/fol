import { Component, OnInit, Input } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observer, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxMasonryOptions } from 'ngx-masonry';
import { PostService } from '../../services/post.service';
import { DialogService } from '../../services/dialog.service';
import { ProductPageComponent } from '../product-page/product-page.component';
import { GlobalVariable } from '../../../global';

@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.component.html',
  styleUrls: ['./user-feed.component.css']
})
export class UserFeedComponent implements OnInit {
  posts: Array<any> = [];
  postsToShow = [];
  offset: number = 0;
  id = 0;
  private baseApiUrl = GlobalVariable.BASE_API_URL;

  public masonryOptions: NgxMasonryOptions = {
    transitionDuration: '0',
    horizontalOrder: true,
    gutter: 39
  };

  onDestroy: Subject<void> = new Subject<void>();

  constructor(
    private feedService: FeedService,
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntil(this.onDestroy))
      .subscribe(params => {
        this.id = +params['id']; // CHNAGE TAKE USER ID FROM USER SERVICE
        //this.generateUserFeed(0, this.id);
      });
    this.generateUserFeed(0, this.id);
  }

  // private processData = posts => {
  //   this.posts = this.posts.concat(posts);
  //   posts.forEach(post => {
  //     this.postService
  //       .getImage(post.postImageAddr)
  //       .pipe(takeUntil(this.onDestroy))
  //       .subscribe(res => {
  //         this.postsToShow = this.postService.createImageFromBlob(
  //           res,
  //           post,
  //           this.postsToShow
  //         );
  //       });
  //   });
  // };

  private processData = posts => {
    this.posts = this.posts.concat(posts);
    posts.forEach(post => {
      let baseAPI = this.baseApiUrl + '/image?s3key=';
      let postObject = {
        post: post,
        postImgSrc: baseAPI + post.postImageAddr
      };

      this.postsToShow.push(postObject);
    });
  };
  generateUserFeed(offset: number, userId: number) {
    this.feedService
      .getUserFeed(userId, offset)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(this.processData);
  }

  fetchImages() {
    this.generateUserFeed(this.offset, this.id);
  }

  openDialog(post): void {
    this.dialogService.openDialog(ProductPageComponent, post);
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }
}
