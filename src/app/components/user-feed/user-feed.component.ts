import { Component, OnInit } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxMasonryOptions } from 'ngx-masonry';
import { PostService } from '../../services/post.service';

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

  public masonryOptions: NgxMasonryOptions = {
    transitionDuration: '0',
    horizontalOrder: true,
    gutter : 55
  };

  onDestroy: Subject<void> = new Subject<void>();

  constructor(
    private feedService: FeedService,
    private activatedRoute: ActivatedRoute,
    private postService: PostService
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
  // };

  private processData = posts => {
    this.posts = this.posts.concat(posts);
    posts.forEach(post => {
      this.postService
        .getImage(post.postImageAddr)
        .pipe(takeUntil(this.onDestroy))
        .subscribe(res => {
          this.createImageFromBlob(res, post);
        });
    });
  };
  generateUserFeed(offset: number, userId: number) {
    this.feedService
      .getUserFeed(userId, offset)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(this.processData);
  }

  createImageFromBlob(image: Blob, post: any) {
    let reader = new FileReader();
    let handler;
    reader.addEventListener(
      'load',
      (handler = () => {
        let postObject = {
          post: post,
          imgSrc: reader.result
        };

        this.postsToShow.push(postObject);
      }),
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  fetchImages() {
    this.generateUserFeed(this.offset, this.id);
  }

  public ngOnDestroy(): void {
    this.onDestroy.next();
  }
}
