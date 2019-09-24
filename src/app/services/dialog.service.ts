import { Injectable, Injector, ComponentRef } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig
} from '@angular/material';
import { UserPost } from '../models/UserPost';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ProductPageComponent } from '../components/product-page/product-page.component';
import { LoginComponent } from '../components/login/login.component';
import { FilePreviewOverlayComponent } from '../components/file-preview-overlay/file-preview-overlay.component';
import {
  ComponentPortal,
  PortalInjector,
  ComponentType
} from '@angular/cdk/portal';

import { FilePreviewOverlayRef } from '../components/file-preview-overlay/file-preview-overlay-ref';

interface FilePreviewDialogConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
}

const DEFAULT_CONFIG: FilePreviewDialogConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'tm-file-preview-dialog-panel'
};

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  userPost: UserPost;
  directingPage: string;

  constructor(
    public dialog: MatDialog,
    private overlay: Overlay,
    private injector: Injector
  ) { }

  openDialog(config: FilePreviewDialogConfig = {}) {
    config.backdropClass = "backdrop-product";
    config.panelClass = "panel-product";
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };
    const overlayRef = this.createOverlay(dialogConfig);
    //const filePreviewPortal = new ComponentPortal(FilePreviewOverlayComponent);
    // Attach ComponentPortal to PortalHost
    //overlayRef.attach(filePreviewPortal);

    const dialogRef = new FilePreviewOverlayRef(overlayRef);
    const overlayComponent = this.attachDialogContainer(
      overlayRef,
      dialogConfig,
      dialogRef
    );

    overlayRef.backdropClick().subscribe(_ => dialogRef.close());
    // const scrollStrategy = this.overlay.scrollStrategies.reposition();
    return dialogRef;
  }

  private createOverlay(config: FilePreviewDialogConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(
    overlayRef: OverlayRef,
    config: FilePreviewDialogConfig,
    dialogRef: FilePreviewOverlayRef
  ) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(
      FilePreviewOverlayComponent,
      null,
      injector
    );

    const containerRef: ComponentRef<
      FilePreviewOverlayComponent
      > = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(
    config: FilePreviewDialogConfig,
    dialogRef: FilePreviewOverlayRef
  ): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(FilePreviewOverlayRef, dialogRef);

    return new PortalInjector(this.injector, injectionTokens);
  }

  private getOverlayConfig(config: FilePreviewDialogConfig): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }

  openModalWindow(component, data?, componentName?) {
    console.log('in openModalWinodw', component, data, componentName);
    const modalWindowConfig = new MatDialogConfig<ProductPageComponent>();

    //dialogConfig.scrollStrategy = scrollStrategy;
    modalWindowConfig.autoFocus = false;
    modalWindowConfig.data = data;
    modalWindowConfig.closeOnNavigation = true;

    if (componentName == 'followersList') {
      modalWindowConfig.data = data;
      modalWindowConfig.width = '400px';
      modalWindowConfig.backdropClass = 'cdk-global-overlay-wrapper-fol';
      modalWindowConfig.panelClass = 'overlay-fol-list';
    }
    // if (data) {
    //   modalWindowConfig.panelClass = 'overlay-product';
    //   modalWindowConfig.backdropClass = 'cdk-global-overlay-wrapper';
    // }

    const dialogRef = this.dialog.open(component, modalWindowConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  postData(post, directingPage) {
    this.userPost = post;
    this.directingPage = directingPage;
  }
}
