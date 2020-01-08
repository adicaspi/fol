import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserPost } from '../../models/UserPost';
import { DialogService } from '../../services/dialog.service';
import { UserService } from '../../services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../models/User';
import { PostService } from '../../services/post.service';
import { PostInfo } from '../../models/PostInfo';
import { Router } from '@angular/router';
import { ThousandSuffixesPipe } from './pipe-transform';
import * as $ from 'jquery';


@Component({
  selector: 'app-product-page-mobile',
  templateUrl: './product-page-mobile.component.html',
  styleUrls: ['./product-page-mobile.component.css']
})
export class ProductPageMobileComponent implements OnInit {
  userPost: UserPost;
  user: User;
  numFollowers: number;
  directingPage: string;
  userProfileSrc: any;
  storeLogoSrc: string;
  postInfo: PostInfo;
  postImageAddr: string;
  imageUrls: string[] = [];
  onDestroy: Subject<void> = new Subject<void>();
  rtl: boolean = false;
  pipeTransform: ThousandSuffixesPipe = new ThousandSuffixesPipe();
  // height: string = '400px';

  private baseApiUrl = environment.BASE_API_URL;
  constructor(
    private dialogService: DialogService,
    private userService: UserService,
    private postService: PostService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userService.getNumberOfFollowers(this.postService.userPostUserId).subscribe(res => {
      this.numFollowers = this.pipeTransform.transform(res);
    })
    this.directingPage = this.dialogService.directingPage;
    this.getPostInfo();


  }

  getPostInfo() {
    this.postService
      .getPostInfo()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(postInfo => {
        this.postInfo = postInfo;
        this.imageUrls.push(
          this.baseApiUrl + '/image?s3key=' + this.postInfo.postImageAddr
        );
        this.imageUrls.push(
          this.baseApiUrl + '/image?s3key=' + this.postInfo.thumbnailAddr
        );
        this.userProfileSrc = this.baseApiUrl + '/image?s3key=' + this.postInfo.userProfileImageAddr;
        this.storeLogoSrc = this.baseApiUrl + '/image?s3key=' + this.postInfo.storeLogoAddr;
        this.postImageAddr = this.baseApiUrl + '/image?s3key=' + this.postInfo.postImageAddr;
        if (postInfo.storeId == 5 || postInfo.storeId == 7) {
          this.rtl = true;
        }
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
      this.router.navigate(['profile', this.postInfo.userId]);
    }
    if (this.directingPage == 'feed') {
      this.router.navigate(['feed', this.postInfo.userId]);
    }
    if (this.directingPage == 'explore') {
      this.router.navigate(['explore', this.postInfo.userId]);
    }
  }

  profilePage() {
    this.router.navigate(['profile', this.postInfo.userId]);
  }
}
