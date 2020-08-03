import { Component } from '@angular/core';
import { DataService } from './services/data/data.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'inspiritvr';
  showTakeRequestButton = false;
  isAuthenticated: boolean;
  constructor(
    private auth: AuthService
  ) {
    this.auth.isAuthenticated.subscribe(
      (isAuthenticated: boolean) => (this.isAuthenticated = isAuthenticated)
    );
  }
  async ngOnInit() {
    this.isAuthenticated = await this.auth.checkAuthenticated();
  }
  logout() {
    this.auth.logout('/');
  }
}
