import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse
} from '@angular/common/http';
import { TimelinePost } from '../models/TimelinePost';
import { UserPost } from '../models/UserPost';
import { FollowItem } from '../models/FollowItem';
import { map } from '../../../node_modules/rxjs/operators';
import { catchError } from 'rxjs/operators';

import { throwError } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class FeedService {
  globalFeedURL =
    'http://sample-env.umnxh3ie2h.us-east-1.elasticbeanstalk.com/social/';
  globaSoicalURL =
    'http://sample-env.umnxh3ie2h.us-east-1.elasticbeanstalk.com/social/';

  constructor(private http: HttpClient) {}

  //returns time line feed for the user in stupid json format
  getTimeLineFeed(
    userId: number,
    offset: number
  ): Observable<Array<TimelinePost>> {
    let params = new HttpParams().set('offset', offset.toString());
    return this.http.get<TimelinePost[]>(
      this.globalFeedURL + userId + '/timeline-feed',
      {
        params: params
      }
    );
  }

  getUserFeed(userId: number, offset: number): Observable<Array<UserPost>> {
    let params = new HttpParams().set('offset', offset.toString());
    return this.http
      .get<Array<UserPost>>(this.globalFeedURL + userId + '/user-feed', {
        params: params
      })
      .pipe(
        catchError(err => {
          console.log('im error', err);
          return throwError('Something bad happened; please try again later.');
        })
      );
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
}
