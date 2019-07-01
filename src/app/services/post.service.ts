import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../../global';
import { PostInfo } from '../models/PostInfo';
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
  constructor(private http: HttpClient) {}

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
