import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private subject = new Subject<any>();
  //private subject = new BehaviorSubject<string>('');

  constructor() { }

  sendMessage(message: string) {
    this.subject.next({ msg: message });
    //this.subject.next(message);
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
