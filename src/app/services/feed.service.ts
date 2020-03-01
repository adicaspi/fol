import { Injectable } from '@angular/core';
import { Observable, Subject, empty } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpParams, HttpResponse
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TimelinePost } from '../models/TimelinePost';
import { FollowItem } from '../models/FollowItem';
import { FeedReturnObject } from '../models/FeedReturnObject';
import { DiscoverPeopleDTO } from '../models/DiscoverPeopleDTO';
import { MessageService } from './message.service';
import { catchError } from '../../../node_modules/rxjs/operators';
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
  private baseApiUrl = environment.BASE_API_URL;
  offset: number = 0;
  prevOffset: number = 0;
  globalFeedURL = this.baseApiUrl + '/social/';
  globaSoicalURL = this.baseApiUrl + '/social/';
  generalURL = this.baseApiUrl + '/general/'
  timelinefeedFilteringDTO: any = {};
  userfeedFilteringDTO: any = {};
  explorefeedFilteringDTO: any = {};
  feedFilteringDTO: any = {};
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

  getTimeLineFeed(userId: number, offset: number): Observable<any> {
    let params = new HttpParams().set('offset', offset.toString());
    return this.http.post<any>(
      this.globalFeedURL + userId + '/timeline-feed', this.feedFilteringDTO, {
        headers: httpOptions.headers,
        observe: "response",
        params: params,
      }
    ).pipe().map(res => {
      if (res.status == 200) {
        let posts: any = res.body['feedPosts'];
        let offset: any = res.body['newOffset'];
        let newPosts: Array<TimelinePost> = posts.map((post) => new TimelinePost(post, post.postImageAddr, post.userProfileImageAddr, post.thumbnail));

        let feedReturnObject = new FeedReturnObject();
        feedReturnObject.newPosts = newPosts;
        feedReturnObject.offset = offset;
        return feedReturnObject;
      }
      if (res.status == 204) {
        return "endOfFeed";
      }
    })
  }


  getExploreFeed(userId: number): Observable<any> {
    return this.http.post<any>(
      this.globalFeedURL + userId + '/explore-feed', this.feedFilteringDTO, {
        headers: httpOptions.headers,
        observe: "response"
      }
    ).pipe(
    )
      .map(res => {
        if (res.status == 200) {
          let posts: any = res.body['feedPosts'];
          let offset: any = res.body['newOffset'];
          let newPosts: Array<TimelinePost> = posts.map((post) => new TimelinePost(post, post.postImageAddr, post.userProfileImageAddr, post.thumbnail));

          let feedReturnObject = new FeedReturnObject();
          feedReturnObject.newPosts = newPosts;
          feedReturnObject.offset = offset;
          return feedReturnObject;
        }
        if (res.status == 204) {
          return "endOfFeed";
        }
      });

  }

  getUserFeed(userId: number, offset: number): Observable<any> {
    let params = new HttpParams().set('offset', offset.toString());
    return this.http.post<Array<any>>(
      this.globalFeedURL + userId + '/user-feed', this.feedFilteringDTO, {
        headers: httpOptions.headers,
        observe: "response",
        params: params,
      }
    ).pipe(
    )
      .map(res => {

        if (res.status == 200) {
          let posts: any = res.body['feedPosts'];
          let offset: any = res.body['newOffset'];
          let newPosts: Array<TimelinePost> = posts.map((post) => new TimelinePost(post, post.postImageAddr, post.userProfileImageAddr, post.thumbnail));

          let feedReturnObject = new FeedReturnObject();
          feedReturnObject.newPosts = newPosts;
          feedReturnObject.offset = offset;
          return feedReturnObject;
        }
        if (res.status == 204) {
          return "endOfFeed";
        }
      });
  }

  discoverPeopleGeneral(): Observable<Array<DiscoverPeopleDTO>> {
    return this.http.get<Array<DiscoverPeopleDTO>>(this.generalURL + '/discover-people').pipe().map(res => {
      let items: any = res;
      let discoverPeopleArray: Array<DiscoverPeopleDTO> =
        items.map((doc) => new DiscoverPeopleDTO(doc));
      return discoverPeopleArray;
    })
  }

  getFollowSlaves(
    id: number,
    offset: number,
  ): Observable<any> {
    //get slaves
    let params = new HttpParams().set('offset', offset.toString());
    return this.http.get<any>(
      this.globaSoicalURL + id + '/follow-slaves',
      {
        observe: "response",
        params: params
      }
    ).pipe().map(res => {
      if (res.status == 200) {
        let followsArray: any = res.body;
        return followsArray;
      }
      if (res.status == 204) {
        return "endOfFeed";
      }
    });
  }

  getFollowMasters(
    id: number,
    offset: number,
  ): Observable<any> {
    let params = new HttpParams().set('offset', offset.toString());
    return this.http.get<any>(
      this.globaSoicalURL + id + '/follow-masters',
      {
        observe: "response",
        params: params
      }
    ).pipe().map(res => {
      if (res.status == 200) {
        let followsArray: any = res.body;
        return followsArray;
      }
      if (res.status == 204) {
        return "endOfFeed";
      }
    });
  }
}
