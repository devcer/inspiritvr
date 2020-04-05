import { Component } from '@angular/core';
import { DataService } from './services/data/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tg-corona-app';
  constructor(private data: DataService) {
    
  }
  createRequest() {
    this.data.createRequest('');
  }
}
