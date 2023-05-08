import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  isSubmitting: boolean;

  // email = new FormControl('', [Validators.required, Validators.email]);
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  remember_me = new FormControl(false);

  show_alert = false;

  constructor(private httpService: AuthService, private router: Router) {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    const email = window.localStorage.getItem('Email');
    const remember_me = window.localStorage.getItem('RememberMe');

    if (remember_me == 'true') {
      this.email.setValue(email);
      this.remember_me.setValue(true);
    }

    this.remember_me.valueChanges.subscribe(
      (response) => {
        if (response == false) {
          window.localStorage.setItem('Email', '');
          window.localStorage.setItem('RememberMe', 'false');
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.isSubmitting = false;
  }

  // event
  onSubmit() {
    this.isSubmitting = true;
    if (this.blockUI.isActive) {
      this.isSubmitting = false;
      return false;
    }

    const email = this.email;
    const password = this.password;
    const remember_me = this.remember_me;

    if (!email.value || !password.value) {
      // email.markAllAsTouched();
      // password.markAllAsTouched();
      this.isSubmitting = false;
      return;
    }

    if (remember_me.value) {
      window.localStorage.setItem('Email', email.value);
      window.localStorage.setItem('RememberMe', 'true');
    } else {
      window.localStorage.setItem('Email', '');
      window.localStorage.setItem('RememberMe', 'false');
    }

    this.AttemptToLogin(email.value, password.value);
  }

  // backend api
  AttemptToLogin(email: any, password: any) {
    this.blockUI.start('Signing in...');
    this.httpService.getToken(email, password).subscribe(
      response => {
        localStorage.setItem('token', response['token']);

        this.show_alert = false;
        this.blockUI.stop();

        this.router.navigate(['planner']);
      },
      error => {
        this.isSubmitting = false;
        localStorage.setItem('token', '');

        this.show_alert = true;
        this.password.reset();
        this.blockUI.stop();
      }
    );
  }

  // custom
  getErrorMessage(type: string) {
    switch (type) {
      case 'email':
        if (this.email.hasError('required')) {
          return 'You must enter a value';
        }
        else if (this.email.hasError('email')) {
          return 'Not a valid email';
        }
        break;
      case 'password':
        if (this.password.hasError('required')) {
          return 'You must enter a value';
        }
        break;
      default:
        break;
    }
    return '';
  }
}
