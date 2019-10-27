import { Component, OnInit } from '@angular/core';
import { UserPost } from '../../models/UserPost';
import { DialogService } from '../../services/dialog.service';
import { UserService } from '../../services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalVariable } from '../../../global';
import { User } from '../../models/User';
import { PostService } from '../../services/post.service';
import { PostInfo } from '../../models/PostInfo';
import { Router } from '@angular/router';
import * as $ from 'jquery';


@Component({
  selector: 'app-product-page-mobile',
  templateUrl: './product-page-mobile.component.html',
  styleUrls: ['./product-page-mobile.component.css']
})
export class ProductPageMobileComponent implements OnInit {
  userPost: UserPost;
  user: User;
  directingPage: string;
  userProfileSrc: any;
  postInfo: PostInfo;
  imageUrls: string[] = [];
  onDestroy: Subject<void> = new Subject<void>();
  rtl: boolean = false;

  private baseApiUrl = GlobalVariable.BASE_API_URL;
  constructor(
    private dialogService: DialogService,
    private userService: UserService,
    private postService: PostService,
    private router: Router
  ) { }

  ngOnInit() {
    //this.userPost = this.dialogService.userPost;
    this.userPost = this.postService.userPost;
    this.directingPage = this.dialogService.directingPage;
    this.userService
      .getUserDetails(this.userPost['post']['userId'])
      .pipe(takeUntil(this.onDestroy))
      .subscribe(user => {
        this.user = user;
        this.userProfileSrc =
          this.baseApiUrl + '/image?s3key=' + this.user.profileImageAddr;
        this.getPostInfo();
      });

  }

  getPostInfo() {
    this.postService
      .getPostInfo(
        this.userPost['post']['userId'],
        this.userPost['post']['postId']
      )
      .pipe(takeUntil(this.onDestroy))
      .subscribe(postInfo => {
        this.postInfo = postInfo;
        this.imageUrls.push(
          this.baseApiUrl + '/image?s3key=' + this.postInfo.thumbnailAddr
        );
        this.imageUrls.push(
          this.baseApiUrl + '/image?s3key=' + this.postInfo.postImageAddr
        );
      })
  }


  setThumbnailImage(image) {
    var mainImageElement = $('#mainImage');
    mainImageElement.attr('src', image);
  }

  // setImage(image) {
  //   var mainImageElement = $('#mainImage');
  //   mainImageElement.attr('src', image);
  //   var description = $('#description');
  //   description.text(this.userPost['post']['description']);
  //   var link = $('#link');
  //   link.attr('href', this.userPost['post']['link']);
  //   var price = $('span.price');
  //   price.text(this.userPost['post']['price']);
  // }

  goBackPage() {
    if (this.directingPage == 'profile') {
      this.router.navigate(['profile', this.user.id]);
    }
    if (this.directingPage == 'feed') {
      this.router.navigate(['feed', this.user.id]);
    }
    if (this.directingPage == 'explore') {
      this.router.navigate(['explore', this.user.id]);
    }
  }
}
