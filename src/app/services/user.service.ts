import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../models/User';
import { Observable } from 'rxjs';
import { DiscoverPeopleDTO } from '../models/DiscoverPeopleDTO';
import { UserDetails } from '../models/UserDetails';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'observe': 'response' })
};

const httpFormDataOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'multipart/form-data'
  })
}


const httpFormDataImage = {
  headers: new HttpHeaders({
    'Content-Type': 'image/jpeg'
  })
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  userId: number;
  username: string;
  user: Observable<UserDetails>;
  private baseApiUrl = environment.BASE_API_URL;
  globalRegisterURL = this.baseApiUrl + '/registration/';
  globaSoicalURL = this.baseApiUrl + '/social/';
  globalInfoURL = this.baseApiUrl + '/user-info/';
  globalSettingsURL = this.baseApiUrl + '/settings/';

  constructor(private http: HttpClient) { }

  register(userForm: any): Observable<any> {
    return this.http.post<any>(this.globalRegisterURL + 'signup', userForm, {
      headers: httpOptions.headers
    });
  }

  loginWithFacebook(code: string): Observable<any> {
    let params = new HttpParams().set('code', code);
    return this.http.get<any>(
      this.globalRegisterURL + 'code-login',
      {
        params: params
      }
    );
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

  updateProfileImage(fd): Observable<any> {
    return this.http.post<any>(
      this.globalSettingsURL + this.userId + '/update-profile-image', fd
    );
  }

  updateUsername(username: string): Observable<any> {
    let params = new HttpParams().set('username', username);
    return this.http.post(
      this.globalSettingsURL + this.userId + '/update-username', { headers: httpOptions.headers }, { params: params }
    );
  }

  updateUserDescription(description: string): Observable<any> {
    let params = new HttpParams().set('description', description);
    return this.http.post(
      this.globalSettingsURL + this.userId + '/update-description', { headers: httpOptions.headers }, { params: params }
    );
  }

  updateFullname(fullName: string): Observable<any> {
    let params = new HttpParams().set('fullName', fullName);
    return this.http.post(
      this.globalSettingsURL + this.userId + '/update-full-name', { headers: httpOptions.headers }, { params: params }
    );
  }

  updateEmail(email: string): Observable<any> {
    let params = new HttpParams().set('email', email);
    return this.http.post(
      this.globalSettingsURL + this.userId + '/update-email', { headers: httpOptions.headers }, { params: params }
    );
  }

  changePassword(password: any): Observable<any> {
    return this.http.post(
      this.globalSettingsURL + this.userId + '/change-password', password, { headers: httpOptions.headers }
    );
  }

  //change to promise
  checkUserNameExists(val: any): Observable<any> {
    let params = new HttpParams().set('username', val);
    return this.http.get<any>(
      this.globalRegisterURL + 'check-username-exists',
      {
        params: params
      }
    );
  }

  checkEmailExists(val: any): Observable<any> {
    let params = new HttpParams().set('email', val);
    return this.http.get<any>(this.globalRegisterURL + 'check-email-exists', {
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

  discoverPeopleUser(): Observable<Array<DiscoverPeopleDTO>> {
    return this.http.get<Array<DiscoverPeopleDTO>>(this.globaSoicalURL + this.userId + '/discover-people').pipe().map(res => {
      let items: any = res;
      let discoverPeopleArray: Array<DiscoverPeopleDTO> =
        items.map((doc) => new DiscoverPeopleDTO(doc));
      return discoverPeopleArray;
    })
  }

  // getUserDetails(id: number): Observable<User> {
  //   console.log("in get user details");
  //   return this.http.get<User>(this.globalInfoURL + id + '/details').pipe(
  //   )
  //     .map(res => {
  //       return new User(res);
  //     });
  // }

  getUserDetails(id: number): Observable<UserDetails> {
    return this.http.get<User>(this.globalSettingsURL + id + '/current-settings').pipe(
    )
      .map(res => {
        return new UserDetails(res);
      });
  }

  getUserProfileInfo(id: number): Observable<User> {
    return this.http.get<User>(this.globalInfoURL + id + '/profile-info').pipe(
    )
      .map(res => {
        return new User(res);
      });
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

  logout() {
    this.userId = null;
    const user_id = sessionStorage.getItem('user_id');
    if (user_id) {
      sessionStorage.removeItem('user_id');
    }
    this.http.get<any>(this.globalRegisterURL + 'logout').subscribe(res => { });
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

  removePost(postId: number) {
    let params = new HttpParams().set('postId', postId.toString());
    return this.http.delete(
      this.globaSoicalURL + this.userId + '/remove-post',
      {
        params
      }
    ).subscribe(res => { });
  }

  hidePost(postId: number) {
    let params = new HttpParams().set('postId', postId.toString());
    return this.http.delete(
      this.globaSoicalURL + this.userId + '/hide-post',
      {
        params
      }
    ).subscribe(res => { });
  }

  didLike(postId: number) {
    let params = new HttpParams().set('postId', postId.toString());
    return this.http.get<boolean>(this.globaSoicalURL + this.userId + '/did-like',
      {
        params
      });
  }

  like(postId: number) {
    let params = new HttpParams().set('postId', postId.toString());
    return this.http.post(this.globaSoicalURL + this.userId + '/like', { headers: httpOptions.headers },
      {
        params: params
      }).subscribe(res => { });
  }

  unlike(postId: number) {
    let params = new HttpParams().set('postId', postId.toString());
    return this.http.post(this.globaSoicalURL + this.userId + '/unlike', { headers: httpOptions.headers },
      {
        params: params
      }).subscribe(res => { });
  }

  didSave(postId: number) {
    let params = new HttpParams().set('postId', postId.toString());
    return this.http.get<boolean>(this.globaSoicalURL + this.userId + '/did-save-item',
      {
        params
      });
  }

  save(postId: number) {
    let params = new HttpParams().set('postId', postId.toString());
    return this.http.post(this.globaSoicalURL + this.userId + '/save-item', { headers: httpOptions.headers },
      {
        params: params
      }).subscribe(res => { });
  }

  unsave(postId: number) {
    let params = new HttpParams().set('postId', postId.toString());
    return this.http.post(this.globaSoicalURL + this.userId + '/unsave-item', { headers: httpOptions.headers },
      {
        params: params
      }).subscribe(res => { });
  }

}

