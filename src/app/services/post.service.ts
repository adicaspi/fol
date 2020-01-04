import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PostInfo } from '../models/PostInfo';
import { UserPost } from '../models/UserPost';
import { MorePosts } from '../models/MorePosts';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'observe': 'response' })
};

interface ResponseMorePosts {
  results: MorePosts[];
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseApiUrl = environment.BASE_API_URL;
  postsUrl: string = this.baseApiUrl + '/image';
  socialUrl: string = this.baseApiUrl + '/social';
  userPost: UserPost;
  userPostUserId: number;
  userPostPostId: number;
  constructor(private http: HttpClient) { }

  getImage(image_adr: string): Observable<Blob> {
    let params = new HttpParams().set('s3key', image_adr);
    return this.http.get(this.postsUrl, {
      params: params,
      responseType: 'blob'
    });
  }

  getPostInfo(): Observable<PostInfo> {
    let postInfoURL = this.socialUrl + '/' + this.userPostUserId + '/post-info';
    let params = new HttpParams().set('postId', this.userPostPostId.toString());
    return this.http.get<PostInfo>(postInfoURL, {
      params: params
    });
  }

  getMorePostsFromUser(): Observable<MorePosts[]> {
    let postInfoURL = this.socialUrl + '/' + this.userPostUserId + '/more-from';
    let params = new HttpParams().set('masterUserId', this.userPostUserId.toString()).append('currPostId', this.userPostPostId.toString());

    return this.http.get<MorePosts[]>(postInfoURL, {
      params: params
    }).pipe(
    )
      .map(res => {
        let response: any = res;
        return response.map((item) => new MorePosts(item.postId, item.postImageAddr));
      });
  }


  incrementPostViews(userId: number, postId: number) {
    let params = new HttpParams().set('postId', postId.toString());
    return this.http.post<any>(
      this.socialUrl + '/' + userId + '/inc-post-views?postId=' + postId, { headers: httpOptions.headers }
    ).subscribe(res => { });
  }

  createImageFromBlob(
    postImage: Blob,
    post: any,
    posts: Array<any>,
    profileImage?: Blob
  ): Array<any> {
    let postObject = {
      post: post,
      postImgSrc: null,
      profileImgSrc: null
    };
    if (profileImage) {
      let profileReader = new FileReader();
      let profileHandler;
      profileReader.addEventListener(
        'load',
        (profileHandler = () => {
          postObject['profileImgSrc'] = profileReader.result;
        }),
        false
      );

      if (profileImage) {
        profileReader.readAsDataURL(profileImage);
      }
    }

    let postReader = new FileReader();
    let postHandler;
    postReader.addEventListener(
      'load',
      (postHandler = () => {
        postObject['postImgSrc'] = postReader.result;
      }),
      false
    );

    if (postImage) {
      postReader.readAsDataURL(postImage);
    }
    posts.push(postObject);

    return posts;
  }
}
