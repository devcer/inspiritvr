import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RequestElement, TicketElement } from 'src/app/pages/requests/requests.component';
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
    return this.http.post(url, {});
  }
  createTicket(data: TicketElement) {
    const url = `${this.serverUrl}/raiseTicket`;
    const formData = new FormData();
    formData.append('nature', data.poc);
    formData.append('requestID',data.requestID);
    formData.append('resource', data.resource);
    formData.append('details', data.resourceDetails);
    formData.append('noOfResourcesNA', data.noOfResourcesNeedAvailable);
    formData.append('noOfResourcesC', '');
    formData.append('noOfResourcesR', '');
    formData.append('duration', data.duration.toString());
    formData.append('freq', data.frequency);
    formData.append('poc', data.poc);
    formData.append('state', data.status);
    formData.append('volunteer', data.volunteer);
    formData.append('comments', data.comment);
    return this.http.post(url, formData);
  }
  getTickets(requestID: string) {
    const url = `${this.serverUrl}/getTickets`;
    const formData = new FormData();
    formData.append('requestID', requestID);
    return this.http.post(url, {});
  }
}
