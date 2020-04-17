import { Component } from '@angular/core';
import { DataService } from './services/data/data.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tg-corona-app';
  showTakeRequestButton = false;
  constructor(private data: DataService, private router: Router) {
    this.router.events.subscribe(event =>  {
      if(event instanceof NavigationEnd ) {
        debugger;
        if(event.url.includes('requests')) {
          this.showTakeRequestButton = true;
        } else {
          this.showTakeRequestButton = false;
        }
      }
    });
  }
  createRequest() {
    this.data.createRequest('');
  }
}
