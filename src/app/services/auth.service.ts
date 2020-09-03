import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseApiUrl = environment.BASE_API_URL;
  private autoLogin = this.baseApiUrl + '/registration/auto-login';
  private authenticated: boolean = false;
  constructor(private http: HttpClient, private userService: UserService, private configService: ConfigService) { }


  isAuthenticated(): Observable<boolean> {
    return this.http.get<any>(this.autoLogin, { observe: 'response' })
      .pipe(
        map(data => {
          this.userService.userId = data.body.userId;
          this.userService.username = data.body.userName;
          this.userService.updateUser(data.body.userId);
          this.configService.setSessionStorage(data.body.userId.toString());
          return true;
        })
      )
    //return Observable.of(true);
  }


  // get getUserAuthentication() {
  //   return this.authenticated;
  // }

  // set setUserAuthentication(auth) {
  //   this.authenticated = auth;
  // }
}
