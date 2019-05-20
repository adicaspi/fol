import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserPost } from '../../models/UserPost';
import { ProductPageComponent } from '../product-page/product-page.component';
import { DialogService } from '../../services/dialog.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input('post') userPost: UserPost;

  constructor(private dialogService: DialogService) {}

  ngOnInit() {}

  // postClicked() {
  //   this.feedService.sendMessage(this.userPost);
  // }

  openDialog(): void {
    this.dialogService.openDialog(ProductPageComponent, this.userPost);
  }
}
