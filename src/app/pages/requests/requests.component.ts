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
  activeTickets = [];
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
  }
  getRequestsList(): void {
    this.api.getRequestsList().subscribe((data) => {
      data.requests.forEach((item) => {
        this.dataSource.data.push({
          logTime: item.date,
          requestID: item.requestID,
          details: item.details,
          poc: item.poc,
          refPoc: item.rpoc,
          channel: item.channel,
          volunteer: item.assignedTo,
          priority: item.priority.toUpperCase(),
        });
        this.dataSource.paginator = this.paginator;
      });
    });
  }
  createRequest() {
    this.api.createRequest(this.requestObj).subscribe(
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
    const dialogRef = this.dialog.open(TakeRequestDialogComponent, {
      width: '600px',
      data: this.requestObj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`The dialog was closed ${JSON.stringify(result)}`);
      if (typeof result !== 'undefined') {
        this.createRequest();
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
    const ticket: TicketElement = {
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
      status: 'Pending',
      volunteer: '',
      comment: ''
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
    this.api.getTickets(requestID).subscribe(data => {
      this.activeTickets = data['response'] || [];
    })
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
  status?: 'Pending' | 'In Progress' | 'Resolved' | 'Unresolved';
}

export interface TicketElement {
  natureOfTicket: 'give' | 'need';
  requestID: string;
  resource: string;
  resourceDetails: string;
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
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Unresolved';
  volunteer: string; // Volunteer Assigned
  createdDate?: string;
  comment: string;
}
