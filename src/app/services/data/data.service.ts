import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private requestSource = new BehaviorSubject('default message');
  currentRequest = this.requestSource.asObservable();
  constructor() { }
  createRequest(message: string) {
    this.requestSource.next(message)
  }
}
