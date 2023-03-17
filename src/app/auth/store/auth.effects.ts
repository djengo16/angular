import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { calculateExpiryDate } from 'app/shared/date-calc.service';
import { environment } from 'environments/environment.dev';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { errorCodeMessages } from '../common/error-code-messages';
import { User } from '../models/user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private apikey = environment.authApiKey;

  authLogin = createEffect((): any =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apikey}`,
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map((resData) => {
              return this.handleAuth(resData);
            }),
            catchError(this.handleError)
          );
      })
    )
  );

  authSignup = createEffect((): any =>
    this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((authData: AuthActions.SignupStart) => {
        return this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apikey}`,
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map((resData) => {
              return this.handleAuth(resData);
            }),
            catchError(this.handleError)
          );
      })
    )
  );

  authRedirect = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  authLogout = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          localStorage.removeItem('userData');
          this.authService.clearLogoutTime();
          this.router.navigate(['/auth']);
        })
      ),
    { dispatch: false }
  );

  autoLogin = createEffect((): any =>
    this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string;
          userId: string;
          token: string;
          expiryDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (userData) {
          const loadedUser = new User(
            userData.email,
            userData.userId,
            userData.token,
            new Date(userData.expiryDate)
          );

          if (loadedUser.token) {
            // After token validation we calculate it by substracting the
            // current date (miliseconds) from the future date
            const expirationDuration =
              new Date(userData.expiryDate).getTime() - new Date().getTime();
            this.authService.setLogoutTimer(expirationDuration);

            return new AuthActions.AuthenticateSuccess({
              email: userData.email,
              userId: userData.userId,
              token: userData.token,
              expiryDate: new Date(userData.expiryDate),
            });
          }
        }

        return { type: '' };
      })
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  private handleAuth(resData) {
    const expiryDate = calculateExpiryDate(+resData.expiresIn);
    this.authService.setLogoutTimer(+resData.expiresIn * 1000);

    const userData = {
      email: resData.email,
      userId: resData.localId,
      token: resData.idToken,
      expiryDate: expiryDate,
    };
    localStorage.setItem('userData', JSON.stringify(userData));

    return new AuthActions.AuthenticateSuccess(userData);
  }

  private handleError(errorRes) {
    let errorMessage = errorCodeMessages['DEFAULT'];

    if (!errorRes.error || !errorRes.error.error) {
      return of(new AuthActions.AuthenticateFail(errorMessage));
    }

    const errorCode = errorRes.error.error.message;
    if (errorCodeMessages[errorCode]) {
      errorMessage = errorCodeMessages[errorCode];
    }
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
}
