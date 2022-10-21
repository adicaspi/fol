import { Component, OnInit } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorsService } from '../../services/errors.service';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-http-error',
  templateUrl: './http-error.component.html',
  styleUrls: ['./http-error.component.css']
})
export class HttpErrorComponent implements HttpInterceptor {
  constructor(private router: Router, private errorsService: ErrorsService, private analyticsService: AnalyticsService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error instanceof Observable) {

          }
          if (error.error instanceof ErrorEvent) {
            // client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            if (error.status == 401) {
              // TODO - add msg something went wrong
              //console.log('status 401 unauth');

              this.router.navigate(['landing']);
            }
            if (error.error.error == 'User Collision') {
              this.errorsService.sendMessage('User Collision');
            }
            if (error.error.error == 'Invalid Authentication Data') {
              this.errorsService.sendMessage('Invalid Authentication Data');

            }
            if (error.error.error == 'Invalid User') {
              this.errorsService.sendMessage('Invalid User');

            }
            if (error.error.error == 'Invalid Email') {
              this.errorsService.sendMessage('Invalid Email');

            }
            if (error.error.error == 'Cognito Exception') {


            }

            if (error.error.error == 'Exchange Rate Exception') {

              console.log('Exchange Rate Exception');
            }
            // server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${
              error.message
              }`;
          }
          return throwError(errorMessage);
        }))
  }
}
  // intercept(
  //   request: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  //   return next.handle(request)
  //     .pipe(
  //       catchError((error: HttpErrorResponse) => {
  //         let errorMsg = '';
  //         if (error.error instanceof ErrorEvent) {
  //           console.log('this is client side error');
  //           errorMsg = `Error: ${error.error.message}`;
  //         }
  //         else {
  //           console.log('this is server side error');
  //           errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
  //         }
  //         console.log(errorMsg);
  //         return throwError(errorMsg);
  //       })
  //     )
  // }


