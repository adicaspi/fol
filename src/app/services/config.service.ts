import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { map } from '../../../node_modules/rxjs/operators';
import { GlobalVariable } from '../../global';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  //'http://sample-env.umnxh3ie2h.us-east-1.elasticbeanstalk.com/registration/auto-login'
  private baseApiUrl = GlobalVariable.BASE_API_URL;
  private autoLogin = this.baseApiUrl + '/registration/auto-login';
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {}

  loadConfigurationData() {
    console.log('im in config service');

    this.http
      .get<any>(this.autoLogin, { observe: 'response' })
      .pipe(
        map(data => {
          console.log('IM IN DATA CONFIG SERVICE', data);
          this.userService.userId = data.body.userId;
          this.userService.username = data.body.username;
          this.router.navigate(['/feed/' + data.body.userId]);
        })
      )
      .toPromise();
  }
  //catch error
}
