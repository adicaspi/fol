import { Injectable } from '@angular/core';
import { Observable, Subject } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private subject = new Subject<any>();

  constructor() { }

  sendMessage(message: string) {
    console.log("in msg sercive");
    this.subject.next({ msg: message });
  }

  clearMessage() {
    console.log("in msg clear");
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
