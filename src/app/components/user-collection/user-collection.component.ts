import { Component, OnInit } from '@angular/core';
import { FeedService } from '../../services/feed.service';
import { Subscription, Subject, Observable } from '../../../../node_modules/rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { User } from '../../models/User';
import { ConfigService } from '../../services/config.service';
import { PostService } from '../../services/post.service';
import { DialogService } from '../../services/dialog.service';


@Component({
  selector: 'app-user-collection',
  templateUrl: './user-collection.component.html',
  styleUrls: ['./user-collection.component.scss']
})
export class UserCollectionComponent implements OnInit {

  constructor(private feedService: FeedService, private userService: UserService, private route: ActivatedRoute, private configService: ConfigService, private postService: PostService, private router: Router, private dialogService: DialogService) { }
  userId = 1;
  collectionCreatedByUserId = 0;
  updateFeed: Subscription
  onDestroy: Subject<void> = new Subject<void>();
  posts = [];
  collectionId: string;
  collectionInfo: Observable<any>;
  public user: Observable<User>;
  private WindowSizeSubscription: Subscription;
  desktop: boolean = false;
  productPageClicked: boolean = false;

  ngOnInit() {
    this.userId = this.userService.getCurrentUser();
    if (this.userId == undefined) {
      this.userId = 4;
    }
    this.checkScreenSize();
    this.collectionId = this.route.snapshot.paramMap.get('id');
    this.getCollectionPosts();
    this.getCollectionInfo();

  }

  getCollectionPosts() {
    this.feedService
      .getCollectionPosts(this.userId, this.collectionId).pipe(takeUntil(this.onDestroy)).subscribe(result => {
        this.posts = this.posts.concat(result.newPosts);
        console.log(this.posts);
      }, error => {
        console.log(error);
      })
  }

  getCollectionInfo() {
    this.feedService.getCollectionInfo(this.userId, this.collectionId).pipe(takeUntil(this.onDestroy)).subscribe(result => {
      this.collectionInfo = result;
      this.collectionCreatedByUserId = result.userId;
      this.updateUser(result.userId)
    });
    ;
  }

  updateUser(id) {
    this.user = this.userService.getUserProfileInfo(id);
  }

  postSalePrice(post) {
    return post.salePrice;
  }

  checkScreenSize() {
    this.WindowSizeSubscription = this.configService.windowSizeChanged.pipe(takeUntil(this.onDestroy)).subscribe(
      value => {
        if (value.width <= 600) {
          this.desktop = false;
        } else {
          this.desktop = true;
        }
      });
  }

  openPostOrLogin(post) {
    // // if (this.registeredUser) {
    this.openDialog(post)
    // // } else {
    // this.openLoginDialog();
    // //  }

  }

  openDialog(post): void {
    this.configService.setGeneralSession('product_id', post.postId);
    this.configService.setGeneralSession('user_id_post_id', post.userId);
    this.postService.userPost = post;
    if (this.desktop) {
      this.dialogService.openDialog();
    } else {
      this.productPageClicked = true;
      this.router.navigate(['product-page', post.postId]);
    }
  }

}
