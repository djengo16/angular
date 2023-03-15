import {
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store/app.reducer';
import { exhaustMap, map, take } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => authState.user),
      exhaustMap((user) => {
        if (user) {
          const modifiedReq = req.clone({
            params: new HttpParams().set('auth', user.token),
          });
          return next.handle(modifiedReq);
        } else {
          return next.handle(req);
        }
      })
    );
  }
}
