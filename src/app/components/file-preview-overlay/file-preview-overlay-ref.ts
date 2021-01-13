import { OverlayRef } from '@angular/cdk/overlay';
import { MessageService } from '../../services/message.service';
import { Optional } from '../../../../node_modules/@angular/core';

export class FilePreviewOverlayRef {
  openedFromGeneralExplore: number = 0;
  constructor(private overlayRef: OverlayRef, @Optional() generalExplore: number
  ) {
    this.openedFromGeneralExplore = generalExplore
  }

  close(): void {
    this.overlayRef.dispose();
  }

  get refferingComponent() {
    return this.openedFromGeneralExplore;
  }


}
