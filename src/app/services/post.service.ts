import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../../global';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'image/jpeg' })
};

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  postsUrl: string = this.baseApiUrl + '/image';
  constructor(private http: HttpClient) {}

  getImage(image_adr: string): Observable<Blob> {
    let params = new HttpParams().set('s3key', image_adr);
    return this.http.get(this.postsUrl, {
      params: params,
      responseType: 'blob'
    });
  }

  createImageFromBlob(image: Blob, post: any, posts: Array<any>): Array<any> {
    let reader = new FileReader();
    let handler;
    reader.addEventListener(
      'load',
      (handler = () => {
        let postObject = {
          post: post,
          imgSrc: reader.result
        };

        //this.postsToShow.push(postObject);
        posts.push(postObject);
      }),
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
    return posts;
  }
}
