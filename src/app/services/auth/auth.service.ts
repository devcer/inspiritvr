import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private authClient = new OktaAuth({
  //   issuer: 'https://{YourOktaDomain}/oauth2/default',
  //   clientId: '{ClientId}'
  // });

  public isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {
  }

  async checkAuthenticated() {
    // const authenticated = await this.authClient.session.exists();
    const authenticated  = !_.isEmpty(localStorage.getItem('auth_token'));
    this.isAuthenticated.next(authenticated);
    return authenticated;
  }

  async login(username: string, password: string) {
    // const transaction = await this.authClient.signIn({username, password});

    // if (transaction.status !== 'SUCCESS') {
    //   throw Error('We cannot handle the ' + transaction.status + ' status');
    // }
    localStorage.setItem('auth_token', "user_logged_in");
    this.isAuthenticated.next(true);

    // this.authClient.session.setCookieAndRedirect(transaction.sessionToken);
  }

  async logout(redirect: string) {
    try {
      localStorage.setItem('auth_token', null);
      this.isAuthenticated.next(false);
      this.router.navigate([redirect]);
    } catch (err) {
      console.error(err);
    }
  }
}
