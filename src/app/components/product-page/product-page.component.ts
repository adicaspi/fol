import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserPost } from '../../models/UserPost';
import { FeedService } from '../../services/feed.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  subscription: Subscription;
  userPost: UserPost;
  showSpinner: boolean = true;
  constructor(
    private feedService: FeedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProductPageComponent>
  ) {
    this.userPost = this.data;
  }

  ngOnInit() {
    console.log('im user post', this.userPost);
  }
}
