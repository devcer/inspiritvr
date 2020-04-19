import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { RequestElement, TicketElement, Person } from 'src/app/pages/requests/requests.component';
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
    formData.append('state', 'Pending');
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
    formData.append('nature', data.natureOfTicket);
    formData.append('requestID',data.requestID);
    formData.append('resource', data.resource);
    formData.append('details', data.resourceDetails);
    formData.append('noOfResourcesNA', data.noOfResourcesNeedAvailable);
    formData.append('noOfResourcesC', '');
    formData.append('noOfResourcesR', '');
    formData.append('duration', data.duration.toString());
    formData.append('freq', data.frequency);
    formData.append('poc', data.poc);
    formData.append('state', 'Open');
    formData.append('volunteer', data.volunteer);
    formData.append('comments', data.comment);
    return this.http.post(url, formData);
  }
  getTicketsList(requestID = '', natureOfRequest = ''): Observable<any> {
    const url = `${this.serverUrl}/searchTicketFilter`;
    const body = requestID === '' ? {} : {requestID};
    natureOfRequest === '' ? null :body['nature'] = natureOfRequest
    return this.http.post(url, body);
  }
  getTicketDetailsByID(ticketID: string) {
    const url = `${this.serverUrl}/getTicketByID`;
    const formData = new FormData();
    formData.append('ticketNo', ticketID);
    return this.http.post(url, {});
  }
  getRequestDetailsByID(requestID: string) {
    const url = `${this.serverUrl}/getRequestByID`;
    const formData = new FormData();
    formData.append('rid', requestID);
    return this.http.post(url, {requestID});
  }
  updateTicketsStatus(reqBody: any): Observable<any> {
    const url = `${this.serverUrl}/modManyTicket`;
    return this.http.post(url, reqBody);
  }
  updateRequestsStatus(reqBody: any): Observable<any> {
    const url = `${this.serverUrl}/modManyRequest`;
    return this.http.post(url, reqBody);
  }
  createUser(userDetails: Person, type: 'user' | 'volunteer'): Observable<any> {
    const formData = new FormData();
    formData.append('name', userDetails.name);
    formData.append('organization', userDetails.organization);
    formData.append('phone', userDetails.phone);
    formData.append('email', userDetails.email);
    formData.append('location', userDetails.location);

    switch(type) {
      case 'user':
        formData.append('party', userDetails.party);
        return this.http.post(`${this.serverUrl}/createPeople`, formData);
      case 'volunteer':
        return this.http.post(`${this.serverUrl}/createVolunteer`, formData)
    }
  }
  getUsersList(type: 'user' | 'volunteer'): Observable<any> {
    switch(type) {
      case 'user':
        return this.http.post(`${this.serverUrl}/getPeople`, {});
      case 'volunteer':
        return this.http.post(`${this.serverUrl}/getVolunteer`, {});
    }
  }
  getRequestsCount() {
    return this.http.post(`${this.serverUrl}/reqCount`, {});
  }
  getTicketsCount() {
    return this.http.post(`${this.serverUrl}/ticCount`, {});
  }
}
