import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthResponseData } from './models/auth-response-data.model';
import { AuthService } from './auth.service';
import { errorCodeMessages } from './common/error-code-messages';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  @ViewChild('authForm') authForm: NgForm;

  constructor(private authService: AuthService) {}

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

      authObs = this.authService.login(email, password);
    } else {
      this.isLoading = true;

      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe({
      next: (responseData) => {
        console.log(responseData);
        this.isLoading = false;
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      },
    });
    this.authForm.reset();
  }
}
