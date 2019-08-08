import { Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig
} from '@angular/material';
import { UserPost } from '../models/UserPost';
import { Overlay } from '@angular/cdk/overlay';
import { ProductPageComponent } from '../components/product-page/product-page.component';
import { LoginComponent } from '../components/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  userPost: UserPost;
  directingPage: string;
  dialogConfig = new MatDialogConfig<ProductPageComponent>();
  constructor(public dialog: MatDialog, private overlay: Overlay) {}

  openDialog(component, data?): void {
    // if (component == 'LoginComponent') {
    //   console.log('im comp');
    // }
    const scrollStrategy = this.overlay.scrollStrategies.reposition();

    //this.dialogConfig.scrollStrategy = scrollStrategy;

    this.dialogConfig.autoFocus = false;
    this.dialogConfig.data = data;
    this.dialogConfig.closeOnNavigation = true;
    // if (component == "ProductPageComponen")
    if (data) {
      this.dialogConfig.panelClass = 'overlay-product';
      this.dialogConfig.backdropClass = 'cdk-global-overlay-wrapper';
    }

    const dialogRef = this.dialog.open(component, this.dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  postData(post, directingPage) {
    this.userPost = post;
    this.directingPage = directingPage;
  }
}
