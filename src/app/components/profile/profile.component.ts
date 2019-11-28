import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserPost } from '../../models/UserPost';
import { DialogService } from '../../services/dialog.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @Input('post') userPost: UserPost;

  constructor(private dialogService: DialogService) { }

  ngOnInit() { }

  // openDialog(): void {
  //   this.dialogService.openModalWindow(ProductPageComponent, this.userPost);
  // }
}
