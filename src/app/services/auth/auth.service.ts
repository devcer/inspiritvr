import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {
  }

  async checkAuthenticated() {
    const authenticated  = !_.isEmpty(localStorage.getItem('auth_token'));
    this.isAuthenticated.next(authenticated);
    return authenticated;
  }

  async login(username: string, password: string) {
    localStorage.setItem('auth_token', "user_logged_in");
    this.isAuthenticated.next(true);
    this.router.navigate(['/home']);
  }

  async logout(redirect: string) {
    try {
      localStorage.setItem('auth_token', '');
      this.isAuthenticated.next(false);
      this.router.navigate([redirect]);
    } catch (err) {
      console.error(err);
    }
  }
}
