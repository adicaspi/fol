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
import { FeedReturnObject } from '../models/FeedReturnObject';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private postsSubject = new Subject<any>();
  private offsetSubject = new Subject<any>();
  private scrollingSubjebt = new Subject<any>();
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  offset: number = 0;
  prevOffset: number = 0;
  globalFeedURL = this.baseApiUrl + '/social/';
  globaSoicalURL = this.baseApiUrl + '/social/';
  timelinefeedFilteringDTO: any = {};
  userfeedFilteringDTO: any = {};
  explorefeedFilteringDTO: any = {};
  currentLoadedFeedComponent: string;


  constructor(private http: HttpClient) {
  }

  updateTimelineFeed(id, offset) {
    this.postsSubject.next(this.getTimeLineFeed(id, offset));
  }

  updateUserFeed(id, offset) {
    this.postsSubject.next(this.getUserFeed(id, offset));
  }

  updateExploreFeed(id) {
    this.postsSubject.next(this.getExploreFeed(id));
  }

  getNewPosts(): Observable<any> {
    return this.postsSubject.asObservable();
  }

  //returns time line feed for the user in stupid json format
  // getTimeLineFeed(
  //   offset: number,
  //   userId: number
  // ): Observable<Array<TimelinePost>> {
  //   console.log("im timelinefeed");
  //   return this.http.post<TimelinePost[]>(
  //     this.globalFeedURL + userId + '/timeline-feed?offset=' + offset, this.timelinefeedFilteringDTO, { headers: httpOptions.headers }
  //   );
  // }

  getTimeLineFeed(userId: number, offset: number): Observable<FeedReturnObject> {
    return this.http.post<TimelinePost[]>(
      this.globalFeedURL + userId + '/timeline-feed?offset=' + offset, this.timelinefeedFilteringDTO, { headers: httpOptions.headers }
    ).pipe(
    )
      .map(res => {
        let posts: any = res['feedPosts'];
        let offset: any = res['newOffset'];
        let newPosts: Array<TimelinePost> = posts.map((post) => new TimelinePost(post, post.postImageAddr, post.userProfileImageAddr, post.thumbnail));

        let feedReturnObject = new FeedReturnObject();
        feedReturnObject.newPosts = newPosts;
        feedReturnObject.offset = offset;
        return feedReturnObject;

      });
  }


  getExploreFeed(userId: number): Observable<FeedReturnObject> {
    return this.http.post<TimelinePost[]>(
      this.globalFeedURL + userId + '/explore-feed', this.explorefeedFilteringDTO, { headers: httpOptions.headers }
    ).pipe(
    )
      .map(res => {
        let posts: any = res['feedPosts'];
        let offset: any = res['newOffset'];
        let newPosts: Array<TimelinePost> = posts.map((post) => new TimelinePost(post, post.postImageAddr, post.userProfileImageAddr, post.thumbnail));

        let feedReturnObject = new FeedReturnObject();
        feedReturnObject.newPosts = newPosts;
        feedReturnObject.offset = offset;
        return feedReturnObject;

      });

  }

  getUserFeed(userId: number, offset: number): Observable<FeedReturnObject> {
    let params = new HttpParams().set('offset', offset.toString());
    return this.http.post<Array<any>>(
      this.globalFeedURL + userId + '/user-feed?offset=' + offset, this.userfeedFilteringDTO, { headers: httpOptions.headers },
    ).pipe(
    )
      .map(res => {
        let posts: any = res['feedPosts'];
        let offset: any = res['newOffset'];
        let newPosts: Array<TimelinePost> = posts.map((post) => new TimelinePost(post, post.postImageAddr, post.userProfileImageAddr, post.thumbnail));

        let feedReturnObject = new FeedReturnObject();
        feedReturnObject.newPosts = newPosts;
        feedReturnObject.offset = offset;
        return feedReturnObject;

      });;
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
}
