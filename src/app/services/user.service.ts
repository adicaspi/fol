import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from '@angular/common/http';
import { User } from '../models/User';
import { Observable } from 'rxjs';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'observe': 'response' })
};

const httpFormDataOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'multipart/form-data'
  })
}
import { GlobalVariable } from '../../global';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  // userId: number = 655; //DELETE SHOULD BE UPDATED FORM CONFIG
  userId: number;
  username: string;
  user: Observable<User>;
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  globalRegisterURL = this.baseApiUrl + '/registration/';
  globaSoicalURL = this.baseApiUrl + '/social/';
  globalInfoURL = this.baseApiUrl + '/user-info/';

  constructor(private http: HttpClient) { }

  register(userForm: any): Observable<any> {
    return this.http.post<any>(this.globalRegisterURL + 'signup', userForm, {
      headers: httpOptions.headers
    });
  }

  getCurrentUser(): any {
    return this.userId;
  }

  updateUser(id: number) {
    this.user = this.getUserDetails(id);
  }

  uploadPost(fd: FormData, desc: string): Observable<any> {
    let params = new HttpParams().set('description', desc);
    return this.http.post<any>(
      this.globaSoicalURL + this.userId + '/upload',
      fd,
      {
        params: params
      }
    );
  }

  updateProfileImage(fd: FormData): Observable<any> {
    //let params = new HttpParams().set('image', fd.toString());
    return this.http.post<any>(
      this.globalInfoURL + this.userId + '/upload-profile-image',
      fd, {
        headers: httpFormDataOptions.headers
      }

    );
  }

  updateUserDescription(description: string) {
    let params = new HttpParams().set('description', description);
    return this.http.post(
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

  checkIsFollowing(masterId: number): Observable<boolean> {
    let params = new HttpParams().set('masterId', masterId.toString());
    return this.http
      .get<boolean>(this.globaSoicalURL + this.userId + '/is-following', {
        params: params
      });
  }

  follow(masterId: number) {
    let params = new HttpParams().set('masterId', masterId.toString());
    return this.http.post(
      this.globaSoicalURL + this.userId + '/follow', { headers: httpOptions.headers },
      {
        params: params
      }).subscribe(res => {
      });
  }

  unFollow(masterId) {
    let params = new HttpParams().set('masterId', masterId.toString());
    return this.http.post<any>(
      this.globaSoicalURL + this.userId + '/unfollow', { headers: httpOptions.headers }, {
        params: params
      }
    ).subscribe(res => { });
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

  login(userForm: any): Observable<any> {
    let reqbody = { username: userForm.email, password: userForm.password };
    return this.http.post<any>(this.globalRegisterURL + 'signin', reqbody, { headers: httpOptions.headers }
    );
  }

  logout(): Observable<any> {
    return this.http.get<any>(this.globalRegisterURL + 'logout');
  }

  //redirect user to home page
  //delete user_id from local storage
  //delete user credentials from user service

  resetPassword(userForm: any) {
    let params = new HttpParams().set('username', userForm.username);

    return this.http.get(this.globalRegisterURL + 'reset-password', {
      params: params
    });
  }

  setNewPassword(userForm: any) {
    let params = {
      username: userForm.email,
      newPassword: userForm.password,
      code: userForm.code
    };

    return this.http.post(
      this.globalRegisterURL + 'set-new-password',

      params,
      { headers: httpOptions.headers }
    );
  }

  search(char: string): Observable<Array<any>> {
    let params = new HttpParams().set('query', char);
    return this.http.get<any[]>(this.baseApiUrl + '/general/search', {
      params: params
    });
  }
}
