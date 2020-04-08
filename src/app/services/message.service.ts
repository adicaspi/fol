import { Injectable } from '@angular/core';
import { Observable, Subject } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private subject = new Subject<any>();

  constructor() { }

  sendMessage(message: string) {
    console.log("in send msg", message);
    this.subject.next({ msg: message });
  }

  clearMessage() {
    console.log("in clear msg");
    this.subject.next();
  }

  getMessage(): Observable<any> {
    console.log("in get msg");
    return this.subject.asObservable();
  }
}
