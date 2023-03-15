import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.dev';
import { catchError, tap, throwError } from 'rxjs';
import { AuthResponseData } from './models/auth-response-data.model';
import { errorCodeMessages } from './common/error-code-messages';
import { User } from './models/user.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  //user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  apiKey = environment.authApiKey;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

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
  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpiryDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpiryDate)
    );

    if (loadedUser.token) {
      // After token validation we calculate it by substracting the
      // current date (miliseconds) from the future date
      const expirationDuration =
        new Date(userData._tokenExpiryDate).getTime() - new Date().getTime();

      this.store.dispatch(
        new AuthActions.Login({
          email: userData.email,
          userId: userData.id,
          token: userData._token,
          expiryDate: new Date(userData._tokenExpiryDate),
        })
      );
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expiryDate = new Date(new Date().getTime() + expiresIn * 1000);

    const user = new User(email, userId, token, expiryDate);
    this.store.dispatch(
      new AuthActions.Login({
        email,
        userId,
        token,
        expiryDate,
      })
    );

    // Since setTimeout works with miliseconds we multiply the seconds.
    // will auto logout after expiration of the token
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
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
