import { Injectable } from '@angular/core';
import { Observable, Subject } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorsService {
  private subject = new Subject<any>();
  constructor() {}

  sendMessage(message: string) {
    this.subject.next({ error: message });
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
