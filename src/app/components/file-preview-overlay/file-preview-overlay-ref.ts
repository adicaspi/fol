import { OverlayRef } from '@angular/cdk/overlay';
import { MessageService } from '../../services/message.service';
import { Optional } from '../../../../node_modules/@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

export class FilePreviewOverlayRef {
  openedFromGeneralExplore: number = 0;
  dialogClosed: boolean = false;

  constructor(private overlayRef: OverlayRef, @Optional() generalExplore: number
  ) {
    this.openedFromGeneralExplore = generalExplore
  }

  close(): void {
    this.dialogClosed = true;
    this.overlayRef.dispose();
  }

  get refferingComponent() {
    return this.openedFromGeneralExplore;
  }


}
