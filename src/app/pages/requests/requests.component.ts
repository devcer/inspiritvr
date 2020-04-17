import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TakeRequestDialogComponent } from 'src/app/components/take-request-dialog/take-request-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data/data.service';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiService } from 'src/app/services/api/api.service';
import Swal from 'sweetalert2';
import { TakeTicketDialogComponent } from 'src/app/components/take-ticket-dialog/take-ticket-dialog.component';
import { formFields } from 'src/app/data/formFields';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
})
export class RequestsComponent implements OnInit {
  timePeriods = ['Today', '3 Days', 'Week', 'Month'];
  selectedTimePeriod = 'Today';
  ELEMENT_DATA: RequestElement[] = [];
  dataSource = new MatTableDataSource<RequestElement>(this.ELEMENT_DATA);
  selection = new SelectionModel<RequestElement>(true, []);
  displayedColumns: string[] = [
    'select',
    'logTime',
    'requestID',
    'details',
    'poc',
    'refPoc',
    'channel',
    'volunteer',
    'priority',
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  requestObj: RequestElement = {
    details: '',
    poc: '',
    refPoc: '',
    channel: '',
    channelValue: '',
    volunteer: '',
    priority: 'LOW',
  };
  activeTickets: TicketElement[] = [];
  requestsList: RequestElement[] = [];
  statusTypes = formFields.status;
  selectedTabIndex = 0;
  requestsCount: any = {
    all: 0,
    open: 0,
    closed: 0,
    blocked: 0,
    cantFix: 0,
    standby: 0,
  };
  constructor(
    public dialog: MatDialog,
    private data: DataService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.data.currentRequest.subscribe((data) => {
      if (data === '') this.openDialog();
    });
    this.getRequestsList();
    this.api.getRequestsCount().subscribe(data => {
      this.requestsCount = {...this.requestsCount, ...data};
    });
  }
  getRequestsList(): void {
    this.requestsList = [];
    this.api.getRequestsList().subscribe((data) => {
      data.requests.forEach((item) => {
        this.requestsList.push({
          logTime: item.date,
          requestID: item.requestID,
          details: item.details,
          poc: item.poc,
          refPoc: item.rpoc,
          channel: item.channel,
          volunteer: item.assignedTo,
          priority: item.priority.toUpperCase(),
          status: item.state
        });
      });
      this.dataSource.data = this.requestsList;
      this.dataSource.paginator = this.paginator;
      this.selectedTabIndex = 0;
      this.selection.clear();
    });
  }
  createRequest(requestObj) {
    this.api.createRequest(requestObj).subscribe(
      (data) => {
        Swal.fire({
          title: 'Request creation successful',
          icon: 'success',
        });
        this.getRequestsList();
      },
      (error) => {
        console.error(error.message || '');
        Swal.fire({
          title: 'Request creation failed',
          icon: 'error',
        });
      }
    );
  }
  createTicket(requestObj) {
    this.api.createTicket(requestObj).subscribe(
      (data) => {
        Swal.fire({
          title: 'Ticket creation successful',
          icon: 'success',
        });
      },
      (error) => {
        console.error(error.message || '');
        Swal.fire({
          title: 'Ticket creation failed',
          icon: 'error',
        });
      }
    );
  }
  openDialog(): void {
    const request = {
        details: '',
        poc: '',
        refPoc: '',
        channel: '',
        channelValue: '',
        volunteer: '',
        priority: 'LOW',
      },
      person: Person = {
        name: '',
        organization: '',
        phone: '',
        email: '',
        location: '',
        party: 'NGO',
      };

    const dialogRef = this.dialog.open(TakeRequestDialogComponent, {
      width: '1200px',
      data: {
        request: { ...request },
        poc: { ...person },
        refPoc: { ...person },
        volunteer: { ...person },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`The dialog was closed ${JSON.stringify(result)}`);
      if (typeof result !== 'undefined') {
        this.createRequest({
          ...result.request,
          ...{ poc: result.poc.name, refPoc: result.refPoc.name, volunteer: result.volunteer.name },
        });
        this.createUser(result.poc, 'user');
        if (result.refPoc.name !== '') {
          this.createUser(result.refPoc, 'user');
        }
        this.createUser(result.volunteer, 'volunteer');
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: RequestElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.requestID + 1
    }`;
  }
  onClickTableCell(row) {
    this.getTicketsList(row.requestID);
    const ticket = {
      // TicketElement + tickets key
      natureOfTicket: 'give',
      requestID: row.requestID,
      resource: '',
      resourceDetails: '',
      noOfResourcesNeedAvailable: '',
      noOfResourcesConsumed: '',
      noOfResourcesRemaining: '',
      duration: 0,
      frequency: 'Daily',
      location: '',
      poc: '',
      status: 'Open',
      volunteer: '',
      comment: '',
      tickets: this.activeTickets,
    };
    const dialogRef = this.dialog.open(TakeTicketDialogComponent, {
      width: '1000px',
      data: ticket,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`The ticket dialog was closed ${JSON.stringify(result)}`);
      if (typeof result !== 'undefined') {
        this.createTicket(result);
      }
    });
  }
  getTickets(requestID: string) {
    this.api.getTicketsList(requestID).subscribe((data) => {
      this.activeTickets = data['response'] || [];
    });
  }
  getTicketsList(requestID: string): void {
    this.activeTickets = [];
    this.api.getTicketsList(requestID).subscribe((data) => {
      data.tickets.forEach((item) => {
        this.activeTickets.push({
          natureOfTicket: item.nature,
          volunteer: item.Volunteer,
          comment: item.comments,
          logTime: item.createdDate,
          duration: item.duration,
          frequency: item.freq,
          noOfResourcesNeedAvailable: item.noOfResourcesNA,
          noOfResourcesConsumed: item.noOfResourcesC,
          noOfResourcesRemaining: item.noOfResourcesR,
          poc: item.poc,
          priority: item.priority,
          requestID: item.requestID,
          resource: item.resource,
          status: item.state,
          ticketID: item.ticketID,
          location: item.location,
        });
      });
    });
  }
  createUser(userDetails: Person, type: 'user' | 'volunteer') {
    this.api.createUser(userDetails, type).subscribe((data) => {
      console.log(`User created successfully ${JSON.stringify(userDetails)}`);
    });
  }
  selectedTabChange(index: any) {
    // ev.index 0: all, 1: pending, 2: progress, 3: resolved, 4: unresolved
    switch(index) {
      case 0:
        this.dataSource.data = this.requestsList;
        break;
      case 1:
        this.dataSource.data = this.requestsList.filter(item => item.status === 'Open');
        break;
      case 2:
        this.dataSource.data = this.requestsList.filter(item => item.status === 'Closed');
        break;
      case 3:
        this.dataSource.data = this.requestsList.filter(item => item.status === 'Blocked');
        break;
      case 4:
        this.dataSource.data = this.requestsList.filter(item => item.status === 'Can’t Fix');
        break;
      case 5:
        this.dataSource.data = this.requestsList.filter(item => item.status === 'Standby');
        break;
    }
    this.dataSource.paginator = this.paginator;
    this.selection.clear();
  }
  updateStatusTypes(ev: any) {
    const body = {state: ev.value, IDs: []};
    if(this.selection.selected.length > 0) {
      this.selection.selected.forEach(item => {
        body.IDs.push(item.requestID);
      });
      this.api.updateRequestsStatus(body).subscribe(data => {
        Swal.fire({
          title: 'Ticket(s) status updated',
          icon: 'success',
        });
        this.getRequestsList();
      });
    } else {
      Swal.fire({
        title: 'No requests selected',
        icon: 'warning',
      });
    }
  }
}

export interface RequestElement {
  logTime?: string;
  requestID?: string;
  details: string;
  poc: string;
  refPoc: string;
  channel: string;
  channelValue?: string;
  volunteer: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  status?: 'Open' | 'Closed' | 'Blocked' | 'Can’t Fix' | 'Standby';
}

export interface TicketElement {
  ticketID?: string;
  natureOfTicket: 'give' | 'need';
  requestID: string;
  resource: string;
  resourceDetails?: string;
  noOfResourcesNeedAvailable: string; // No of Resources Need/ Available
  noOfResourcesConsumed: string; // No of resources Consumed
  noOfResourcesRemaining: string; // No of resources Remaining
  duration: number; // In days
  frequency:
    | 'Daily'
    | 'Once in Two days'
    | 'Weekly'
    | 'Breakfast'
    | 'Lunch'
    | 'Dinner'
    | 'Breakfast & Lunch'
    | 'Lunch & Dinner'
    | 'Breakfast & Dinner'
    | 'Breakfast, Lunch & Dinner';
  poc: string;
  location: string;
  status: 'Open' | 'Closed' | 'Blocked' | 'Can’t Fix' | 'Standby';
  volunteer: string; // Volunteer Assigned
  logTime?: string;
  comment: string;
  priority?: string;
}
export interface Person {
  name: string;
  organization: string;
  phone: string;
  email: string;
  location: string;
  party?: string;
  creation_date?: string;
}
