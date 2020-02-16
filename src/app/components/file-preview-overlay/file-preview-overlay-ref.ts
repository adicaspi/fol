import { OverlayRef } from '@angular/cdk/overlay';
import { MessageService } from '../../services/message.service';

export class FilePreviewOverlayRef {
  constructor(private overlayRef: OverlayRef,
  ) { }

  close(): void {
    this.overlayRef.dispose();
  }
}
