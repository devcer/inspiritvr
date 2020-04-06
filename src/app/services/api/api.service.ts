import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RequestElement } from 'src/app/pages/requests/requests.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  serverUrl = environment.serverUrl;
  constructor(private http: HttpClient) {}
  createRequest(
    // poc: string,
    // rpoc: string,
    // channel: string,
    // details: string,
    // priority: 'HIGH' | 'MEDIUM' | 'LOW',
    // assignedTo: string
    data: RequestElement
  ): Observable<any> {
    const url = `${this.serverUrl}/raiseRequest`;
    const formData = new FormData();
    formData.append('poc', data.poc);
    formData.append('rpoc',data.refPoc);
    formData.append('channel', data.channel);
    formData.append('details', data.details);
    formData.append('priority', data.priority);
    formData.append('state', 'open');
    formData.append('assignedTo', data.volunteer);
    return this.http.post(url, formData);
  }
  getRequestsList(): Observable<any> {
    const url = `${this.serverUrl}/getRequests`;
    return this.http.post(url, {})
  }
}
