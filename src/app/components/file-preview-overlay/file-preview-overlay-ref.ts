import { OverlayRef } from '@angular/cdk/overlay';
import { MessageService } from '../../services/message.service';

export class FilePreviewOverlayRef {
  constructor(private overlayRef: OverlayRef,
    private messageService: MessageService) { }

  close(): void {
    this.overlayRef.dispose();
    this.messageService.sendMessage("product page closed");
    this.messageService.clearMessage();
  }
}
