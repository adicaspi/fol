import { Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig
} from '@angular/material';
import { UserPost } from '../models/UserPost';
import { Overlay, ComponentType } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  userPost: UserPost;
  directingPage: string;
  constructor(public dialog: MatDialog, private overlay: Overlay) {}

  openDialog(component, data?): void {
    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.disableClose = false;

    dialogConfig.scrollStrategy = scrollStrategy;

    const dialogRef = this.dialog.open(component, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  postData(post, directingPage) {
    this.userPost = post;
    this.directingPage = directingPage;
  }
}
