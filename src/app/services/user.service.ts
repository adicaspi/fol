import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from '@angular/common/http';
import { User } from '../models/User';
import { Observable } from 'rxjs/Observable';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
import { GlobalVariable } from '../../global';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userId: number;
  username: string;
  user: Observable<User>;
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  globalRegisterURL = this.baseApiUrl + '/registration/';
  globaSoicalURL = this.baseApiUrl + '/social/';
  globalInfoURL = this.baseApiUrl + '/user-info/';

  constructor(private http: HttpClient) {}

  register(userForm: any): Observable<any> {
    console.log(userForm);
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
    console.log('im in upload post');
    let params = new HttpParams().set('description', desc);
    return this.http.post<any>(
      this.globaSoicalURL + this.userId + '/upload',
      fd,
      {
        params: params
      }
    );
  }

  updateUserDescription(description: string) {
    console.log('im userid', this.userId);
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

  login(userForm: any): Observable<any> {
    console.log('im in login');
    return this.http.get<any>(this.globalRegisterURL + 'signin', {
      params: { username: userForm.email, password: userForm.password }
    });
  }

  logout(): Observable<any> {
    return this.http.get<any>(this.globalRegisterURL + 'logout');
  }

  resetPassword(userForm: any) {
    //console.log('in reset pass', userForm.email);
    let params = new HttpParams().set('username', userForm.username);
    console.log(params);
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
}
