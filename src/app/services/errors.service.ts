import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorsService {
  private subject = new Subject<any>();

  sendMessage(message: string) {
    console.log("in send msg", message);
    this.subject.next({ error: message });
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    console.log("in get msg");
    return this.subject.asObservable();
  }
}
