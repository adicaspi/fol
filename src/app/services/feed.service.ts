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
import { FilteringDTO } from '../models/FilteringDTO';
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
  filteringDTO = new FilteringDTO();

  constructor(private http: HttpClient) { }

  //returns time line feed for the user in stupid json format
  getTimeLineFeed(
    offset: number,
    userId: number
  ): Observable<Array<TimelinePost>> {
    console.log("in timeline feed", this.filteringDTO);
    return this.http.post<TimelinePost[]>(
      this.globalFeedURL + userId + '/timeline-feed?offset=' + offset, this.filteringDTO, { headers: httpOptions.headers }
    );
  }

  getExploreFeed(userId: number): Observable<Array<TimelinePost>> {
    return this.http.post<TimelinePost[]>(
      this.globalFeedURL + userId + '/explore-feed', { headers: httpOptions.headers }
    );

  }

  getUserFeed(userId: number, offset: number) {
    let params = new HttpParams().set('offset', offset.toString());
    return this.http.post<Array<any>>(
      this.globalFeedURL + userId + '/user-feed', { headers: httpOptions.headers },
      {
        params: params
      }
    );
  }

  getFollowSlaves(
    id: number,
    offset: number,
  ): Observable<Array<FollowItem>> {
    //get slaves
    let params = new HttpParams().set('offset', offset.toString());
    return this.http.get<Array<FollowItem>>(
      this.globaSoicalURL + id + '/follow-slaves',
      {
        params
      }
    );
  }

  getFollowMasters(
    id: number,
    offset: number,
  ): Observable<Array<FollowItem>> {
    let params = new HttpParams().set('offset', offset.toString());
    return this.http.get<Array<FollowItem>>(
      this.globaSoicalURL + id + '/follow-masters',
      {
        params
      }
    )
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
