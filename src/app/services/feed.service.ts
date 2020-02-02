import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TimelinePost } from '../models/TimelinePost';
import { FollowItem } from '../models/FollowItem';
import { FeedReturnObject } from '../models/FeedReturnObject';
import { DiscoverPeopleDTO } from '../models/DiscoverPeopleDTO';
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
      this.globalFeedURL + userId + '/timeline-feed?offset=' + offset, this.feedFilteringDTO, { headers: httpOptions.headers }
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
      this.globalFeedURL + userId + '/explore-feed', this.feedFilteringDTO, { headers: httpOptions.headers }
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
      this.globalFeedURL + userId + '/user-feed?offset=' + offset, this.feedFilteringDTO, { headers: httpOptions.headers }
    ).pipe(
    )
      .map(res => {

        if (res) {
          let posts: any = res['feedPosts'];
          let offset: any = res['newOffset'];
          let newPosts: Array<TimelinePost> = posts.map((post) => new TimelinePost(post, post.postImageAddr, post.userProfileImageAddr, post.thumbnail));

          let feedReturnObject = new FeedReturnObject();
          feedReturnObject.newPosts = newPosts;
          feedReturnObject.offset = offset;
          return feedReturnObject;
        } else {
          let newPosts: any = null;
          let offset: any = null;
          let feedReturnObject = new FeedReturnObject();
          feedReturnObject.newPosts = newPosts;
          feedReturnObject.offset = offset;
          return feedReturnObject
        }


      });;
  }

  discoverPeople(): Observable<Array<DiscoverPeopleDTO>> {
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
