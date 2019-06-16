import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse
} from '@angular/common/http';
import { TimelinePost } from '../models/TimelinePost';
import { UserPost } from '../models/UserPost';
import { FollowItem } from '../models/FollowItem';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { GlobalVariable } from '../../global';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private subject = new Subject<any>();
  private scrollingSubjebt = new Subject<any>();
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  globalFeedURL = this.baseApiUrl + '/social/';
  globaSoicalURL = this.baseApiUrl + '/social/';
  // 'http://sample-env.umnxh3ie2h.us-east-1.elasticbeanstalk.com/social/';

  constructor(private http: HttpClient) {}

  //returns time line feed for the user in stupid json format
  getTimeLineFeed(
    offset: number,
    userId: number
  ): Observable<Array<TimelinePost>> {
    let params = new HttpParams().set('offset', offset.toString());
    return this.http.get<TimelinePost[]>(
      this.globalFeedURL + userId + '/timeline-feed',
      {
        params: params
      }
    );
  }

  getUserFeed(userId: number, offset: number) {
    let params = new HttpParams().set('offset', offset.toString());
    return this.http.get<Array<any>>(
      this.globalFeedURL + userId + '/user-feed',
      {
        params: params
      }
    );
    // .pipe(
    //   catchError(err => {
    //     console.log('im error', err);
    //     return throwError('Something bad happened; please try again later.');
    //   })
    // );
  }

  getSlavesMasters(
    id: number,
    offset: number,
    flag: number
  ): Observable<Array<FollowItem>> {
    //get slaves
    console.log('im in feed service flag is:', flag);
    if (flag) {
      let params = new HttpParams().set('offset', offset.toString());
      return this.http.get<Array<FollowItem>>(
        this.globaSoicalURL + id + '/follow-slaves',
        {
          params
        }
      );
    }
    //get masters
    else {
      console.log('im in masters');
      let params = new HttpParams().set('offset', offset.toString());
      return this.http.get<Array<FollowItem>>(
        this.globaSoicalURL + id + '/follow-masters',
        {
          params
        }
      );
    }
  }

  sendMessage(message: any) {
    this.subject.next({ post: message });
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  scrollingEventSendMsg(message: any) {
    this.scrollingSubjebt.next(message);
  }

  scrollingEventGetMsg(): Observable<any> {
    return this.scrollingSubjebt.asObservable();
  }
}
