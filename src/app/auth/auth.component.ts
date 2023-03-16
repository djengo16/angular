import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthResponseData } from './models/auth-response-data.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  @ViewChild('authForm') authForm: NgForm;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.store.select('auth').subscribe((authState) => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.authForm.reset();
  }

  onAuthSubmit() {
    if (!this.authForm.valid) {
      return;
    }

    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      this.isLoading = true;

      //authObs = this.authService.login(email, password);
      this.store.dispatch(
        new AuthActions.LoginStart({ email: email, password: password })
      );
    } else {
      this.isLoading = true;

      authObs = this.authService.signup(email, password);
    }

    this.store.select('auth').subscribe((authState) => {});
    // authObs.subscribe({
    //   next: (responseData) => {
    //     this.isLoading = false;
    //     this.router.navigate(['/recipes']);
    //   },
    //   error: (errorMessage) => {
    //     this.error = errorMessage;
    //     this.isLoading = false;
    //   },
    // });
    this.authForm.reset();
  }

  onHandleError() {
    this.error = null;
  }
}
