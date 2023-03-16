import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { calculateExpiryDate } from 'app/shared/date-calc.service';
import { environment } from 'environments/environment.dev';
import { catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { errorCodeMessages } from '../common/error-code-messages';

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
              const expiryDate = calculateExpiryDate(+resData.expiresIn);
              return new AuthActions.Login({
                email: resData.email,
                userId: resData.localId,
                token: resData.idToken,
                expiryDate: expiryDate,
              });
            }),
            catchError((errorRes) => {
              let errorMessage = errorCodeMessages['DEFAULT'];

              if (!errorRes.error || !errorRes.error.error) {
                return of(new AuthActions.LoginFail(errorMessage));
              }

              const errorCode = errorRes.error.error.message;
              if (errorCodeMessages[errorCode]) {
                errorMessage = errorCodeMessages[errorCode];
              }
              return of(new AuthActions.LoginFail(errorMessage));
            })
          );
      })
    )
  );

  authSuccess = createEffect(
    (): any =>
      this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        tap(() => {
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
