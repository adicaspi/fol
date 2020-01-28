import { Injectable } from '@angular/core';
import { Observable, Subject } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private subject = new Subject<any>();

  constructor() { }

  sendMessage(message: string) {
    this.subject.next({ msg: message });
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
