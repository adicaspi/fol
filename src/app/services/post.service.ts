import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../../global';
import { PostInfo } from '../models/PostInfo';
import { UserPost } from '../models/UserPost';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'image/jpeg' })
};

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  postsUrl: string = this.baseApiUrl + '/image';
  socialUrl: string = this.baseApiUrl + '/social';
  userPost: UserPost;
  constructor(private http: HttpClient) { }

  getImage(image_adr: string): Observable<Blob> {
    let params = new HttpParams().set('s3key', image_adr);
    return this.http.get(this.postsUrl, {
      params: params,
      responseType: 'blob'
    });
  }

  getPostInfo(userId: number, postId: number): Observable<PostInfo> {
    let postIdString = postId.toString();
    let postInfoURL = this.socialUrl + '/' + userId + '/post-info';
    let params = new HttpParams().set('postId', postIdString);
    return this.http.get<PostInfo>(postInfoURL, {
      params: params
    });
  }

  getMorePostsFromUser(masterUserId: number, currPostId: number): Observable<any> {
    let postInfoURL = this.socialUrl + '/' + masterUserId + '/more-from';
    let params = new HttpParams().set('masterUserId', masterUserId.toString()).append('currPostId', currPostId.toString());

    return this.http.get<any>(postInfoURL, {
      params: params
    });
  }

  incrementPostViews(masterUserId: number, postId: number) {
    let params = new HttpParams().set('postId', postId.toString());
    return this.http.post<any>(
      this.socialUrl + '/' + masterUserId + '/inc-post-view', { headers: httpOptions.headers }, {
        params: params
      }
    ).subscribe(res => { });;
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
