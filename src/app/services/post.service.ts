import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { map } from '../../../node_modules/rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'image/jpeg' })
};

@Injectable({
  providedIn: 'root'
})
export class PostService {
  postsUrl: string =
    'http://Sample-env.umnxh3ie2h.us-east-1.elasticbeanstalk.com/image';
  constructor(private http: HttpClient, private domSanitizer: DomSanitizer) {}

  getImage(image_adr: string): Observable<Blob> {
    console.log('in service - get profile image', image_adr);

    let params = new HttpParams().set('s3key', image_adr);
    return this.http.get(this.postsUrl, {
      params: params,
      responseType: 'blob'
    });
  }

  // .toPromise()
  // .then(data => {
  //   let res = this.domSanitizer.bypassSecurityTrustUrl(
  //     URL.createObjectURL(data)
  //   );
  //   return res;
}
