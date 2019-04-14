import { Component, OnInit } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpXsrfTokenExtractor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
@Component({
  selector: 'app-xsrf-interceptor',
  templateUrl: './xsrf-interceptor.component.html',
  styleUrls: ['./xsrf-interceptor.component.css']
})
export class XsrfInterceptorComponent implements HttpInterceptor {
  constructor(private tokenExtractor: HttpXsrfTokenExtractor) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('im xsrf-interceptor');
    const headerName = 'X-XSRF-TOKEN';
    let token = this.tokenExtractor.getToken() as string;
    console.log('im in xsrf ');
    if (token !== null && req.method == 'POST') {
      req = req.clone({ headers: req.headers.set(headerName, token) });
    }
    return next.handle(req);
  }
}
