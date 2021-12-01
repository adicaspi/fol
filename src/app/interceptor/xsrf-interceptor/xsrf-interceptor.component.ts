import { Component, OnInit } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpXsrfTokenExtractor,
  HttpHandler,
  HttpRequest,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserService } from '../../services/user.service';
import { ConfigService } from '../../services/config.service';
@Component({
  selector: 'app-xsrf-interceptor',
  templateUrl: './xsrf-interceptor.component.html',
  styleUrls: ['./xsrf-interceptor.component.css']
})
export class XsrfInterceptorComponent implements HttpInterceptor {
  constructor(private tokenExtractor: HttpXsrfTokenExtractor,
    private configService: ConfigService) { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headerName = 'X-XSRF-TOKEN';
    let region = this.configService.getUserRegion("region") as string;

    let token = this.tokenExtractor.getToken() as string;



    if (token !== null && req.method == 'POST') {
      req = req.clone({ headers: req.headers.set(headerName, token) });


    }

    req = req.clone({ headers: req.headers.set('region', region) });



    return next.handle(req);
  }
}
