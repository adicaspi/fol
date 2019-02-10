import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {
  userId: number = 306;
  username: string;
  globalRegisterURL =
    'http://sample-env.umnxh3ie2h.us-east-1.elasticbeanstalk.com/registration/';
  globaSoicalURL =
    'http://sample-env.umnxh3ie2h.us-east-1.elasticbeanstalk.com/social/';
  globalInfoURL =
    'http://sample-env.umnxh3ie2h.us-east-1.elasticbeanstalk.com/user-info/';
  globalUploadPostURL: string =
    'http://sample-env.umnxh3ie2h.us-east-1.elasticbeanstalk.com/social/305/upload';
  constructor(private http: HttpClient) {}

  //change to promise
  register(userForm: any): Observable<any> {
    console.log(userForm);
    return this.http.post<any>(this.globalRegisterURL + 'signup', userForm, {
      headers: httpOptions.headers
    });
  }

  getCurrentUser(): any {
    return this.userId;
  }
  //change to promise
  uploadPost(fd: FormData, desc: string): Observable<any> {
    let params = new HttpParams().set('description', desc);
    return this.http.post<any>(this.globalUploadPostURL, fd, {
      params: params
    });
  }

  updateUserDescription(description: string) {
    let params = new HttpParams().set('description', description);
    return this.http.put(
      this.globalInfoURL + this.userId + '/update-description',
      {
        params: params
      }
    );
  }

  //change to promise
  checkUserNameExists(val: any): Observable<any> {
    let params = new HttpParams().set('username', val);
    return this.http.get<any>(
      this.globalRegisterURL + '/check-username-exists',
      {
        params: params
      }
    );
  }

  checkEmailExists(val: any): Observable<any> {
    let params = new HttpParams().set('email', val);
    return this.http.get<any>(this.globalRegisterURL + '/check-email-exists', {
      params: params
    });
  }

  checkIsFollowing(masterId: number): Promise<boolean> {
    console.log('im masterid', masterId);
    let params = new HttpParams().set('masterId', masterId.toString());
    return this.http
      .get<boolean>(this.globaSoicalURL + this.userId + '/is-following', {
        params: params
      })
      .toPromise()
      .then(data => {
        return data;
      });
  }
  follow(master: any) {
    let params = new HttpParams().set('masterId', master);
    return this.http.put(
      this.globaSoicalURL + this.userId + '/follow',
      master,
      {
        params: params
      }
    );
  }

  unFollow(master: any) {
    let params = new HttpParams().set('masterId', master);
    return this.http.put(
      this.globaSoicalURL + this.userId + '/follow',
      master,
      {
        params: params
      }
    );
  }

  getUserDetails(id: number): Observable<any> {
    return this.http.get(this.globalInfoURL + id + '/details');
  }

  getNumberOfFollowing(id: number): Observable<any> {
    return this.http.get<any>(this.globalInfoURL + id + '/num-following');
  }

  getNumberOfFollowers(id: number): Observable<any> {
    return this.http.get<any>(this.globalInfoURL + id + '/num-followers');
  }

  getNumberOfPosts(id: number): Observable<any> {
    return this.http.get<any>(this.globalInfoURL + id + '/num-posts');
  }

  //TODO

  login(userForm: any): Observable<any> {
    console.log(userForm);
    return this.http.post<any>(this.globalRegisterURL + 'signin', userForm, {
      headers: httpOptions.headers
    });
  }
}
