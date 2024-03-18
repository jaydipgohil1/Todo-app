import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService, private authService: AuthService, private router: Router,) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        retry(0),
        catchError((error: HttpErrorResponse) => {
          var message = '';
          if (error.statusText === "Unknown Error")
            message = 'Network Error occurred'
          // else if (error.statusText === "Not Found") message = 'Url Not Found';
          else if (error.status === 403 && error.statusText === "Forbidden") {
            message = error?.error?.message
            localStorage.removeItem('token');
            this.router.navigate(['/log-in']);
            this.authService.setIsAuthentic(false);
          }
          else message = error?.error?.message;
          this.notificationService.showError(message);
          return throwError(() => message);
        })
      )
  }
}
