import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  HttpParams
  , HttpClient
} from '@angular/common/http';
import { GlobalVariable } from '../../global';


@Injectable({
  providedIn: 'root'
})
export class ErrorsService {
  private subject = new Subject<any>();
  private baseApiUrl = GlobalVariable.BASE_API_URL;

  constructor(private http: HttpClient) { }

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
