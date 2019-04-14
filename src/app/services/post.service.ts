import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
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
  //'http://Sample-env.umnxh3ie2h.us-east-1.elasticbeanstalk.com/image';
  constructor(private http: HttpClient) {}

  getImage(image_adr: string): Observable<Blob> {
    console.log('in service - get profile image', image_adr);

    let params = new HttpParams().set('s3key', image_adr);
    return this.http.get(this.postsUrl, {
      params: params,
      responseType: 'blob'
    });
  }

  // mockRequest(): Observable<any> {
  //   let params = new HttpParams().set('name', 'adi');
  //   return this.http.post('http://localhost:3000/exp', {
  //     params
  //   });
  // }
}
