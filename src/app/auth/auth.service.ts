import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.dev';
import { BehaviorSubject, catchError, Subject, tap, throwError } from 'rxjs';
import { AuthResponseData } from './models/auth-response-data.model';
import { errorCodeMessages } from './common/error-code-messages';
import { User } from './models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  apiKey = environment.authApiKey;

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) =>
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            parseInt(resData.expiresIn)
          )
        )
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) =>
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            parseInt(resData.expiresIn)
          )
        )
      );
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expiryDate = new Date(new Date().getTime() + expiresIn * 1000);

    const user = new User(email, userId, token, expiryDate);
    this.user.next(user);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = errorCodeMessages['DEFAULT'];

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => new Error(errorMessage));
    }

    const errorCode = errorRes.error.error.message;
    if (errorCodeMessages[errorCode]) {
      errorMessage = errorCodeMessages[errorCode];
    }
    return throwError(() => new Error(errorMessage));
  }
}
