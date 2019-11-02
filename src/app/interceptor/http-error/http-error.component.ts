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
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorsService } from '../../services/errors.service';

@Component({
  selector: 'app-http-error',
  templateUrl: './http-error.component.html',
  styleUrls: ['./http-error.component.css']
})
export class HttpErrorComponent implements HttpInterceptor {
  constructor(private router: Router, private errorsService: ErrorsService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          if (error.status == 401) {
            // TODO - add msg something went wrong
            console.log('status 401 unauth');
            this.router.navigate(['landing']);
          }
          if (error.error.error == 'User Collision') {
            this.errorsService.sendMessage('User Collision');
          }
          if (error.error.error == 'Invalid Authentication Data') {
            this.errorsService.sendMessage('Invalid Authentication Data');
            console.log("hi adi in error comp invalid authen");
          }
          if (error.error.error == 'Invalid User') {
            this.errorsService.sendMessage('Invalid User');
            console.log("hi adi in error comp");
          }
          if (error.error.error == 'Cognito Exception') {
            //this.router.navigate(['/forgotpassword']);
            console.log('now caught');
          }

          // server-side error
          console.log('in handler', error);
          errorMessage = `Error Code: ${error.status}\nMessage: ${
            error.message
            }`;
        }
        // window.alert(errorMessage);
        console.log('im before throweeror');
        return throwError(errorMessage);
      })
    );
  }
}
