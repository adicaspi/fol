import { Injectable, Injector, ComponentRef, Renderer2, RendererFactory2 } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig
} from '@angular/material';
import { UserPost } from '../models/UserPost';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { LoginComponent } from '../components/login/login.component';
import { FilePreviewOverlayComponent } from '../components/file-preview-overlay/file-preview-overlay.component';
import {
  ComponentPortal,
  PortalInjector,
  ComponentType
} from '@angular/cdk/portal';

import { FilePreviewOverlayRef } from '../components/file-preview-overlay/file-preview-overlay-ref';
import { FollowingListMobileComponent } from '../components/following-list-mobile/following-list-mobile.component';
import { MessageService } from './message.service';

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
  followingDialogRef: MatDialogRef<{}, any>;
  desktop: boolean;
  followingDialogDataObject = {
    userId: 0,
    flag: 0,
    title: ''
  };
  private renderer: Renderer2;

  constructor(
    public dialog: MatDialog,
    private overlay: Overlay,
    private injector: Injector,
    private rendererFactory: RendererFactory2,
    private messageService: MessageService
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

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

    this.renderer.addClass(overlayRef.hostElement.parentElement, 'product-overlay-container');
    overlayRef.backdropClick().subscribe(_ => {
      this.renderer.removeClass(overlayRef.hostElement.parentElement, 'product-overlay-container');
      dialogRef.close();
    });
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

  openModalWindow(component, componentName?, data?) {
    const modalWindowConfig = new MatDialogConfig<any>();
    modalWindowConfig.autoFocus = false;
    modalWindowConfig.data = data;
    modalWindowConfig.closeOnNavigation = true;

    if (componentName == 'followersList') {
      modalWindowConfig.data = data;
      modalWindowConfig.width = '400px';
      modalWindowConfig.backdropClass = 'cdk-global-overlay-wrapper-fol';
      modalWindowConfig.panelClass = 'overlay-fol-list';
    }

    const followingDialogRef = this.dialog.open(component, modalWindowConfig);
    this.followingDialogRef = followingDialogRef;
  }

  closeFollowingDialog(followingFlag) {
    this.followingDialogRef.close(followingFlag);
  }

  postData(post, directingPage) {
    this.userPost = post;
    this.directingPage = directingPage;
  }
}
