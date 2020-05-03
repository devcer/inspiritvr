import { Component, OnInit, ViewChild } from '@angular/core';
import { TicketElement } from '../requests/requests.component';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/services/data/data.service';
import { ApiService } from 'src/app/services/api/api.service';
import { formFields } from 'src/app/data/formFields';
import Swal from 'sweetalert2';
import { TicketDetailsComponent } from 'src/app/components/ticket-details/ticket-details.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit {
  timePeriods = ['Today', '3 Days', 'Week', 'Month'];
  ELEMENT_DATA: TicketElement[] = [];
  dataSource = new MatTableDataSource<TicketElement>(this.ELEMENT_DATA);
  selection = new SelectionModel<TicketElement>(true, []);
  displayedColumns: string[] = [
    'select',
    'logTime',
    'ticketID',
    'resource',
    'noOfResourcesNeedAvailable',
    'noOfResourcesConsumed',
    'noOfResourcesRemaining',
    'poc',
    'volunteer',
    'duration',
    'frequency',
    'location',
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  natureOfTickets = 'give';
  statusTypes = formFields.status;
  ticketsList: TicketElement[] = [];
  selectedTabIndex = 0;
  ticketsCount: any = {
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
    // this.data.currentRequest.subscribe((data) => {
    //   if (data === '') this.openDialog();
    // });
    this.getTicketsList('', this.natureOfTickets);
    this.api.getTicketsCount().subscribe((data) => {
      this.ticketsCount = { ...this.ticketsCount, ...data };
    });
  }
  getTicketsList(ticketID = '', natureOfTicket = ''): void {
    this.ticketsList = [];
    this.api.getTicketsList(ticketID, natureOfTicket).subscribe((data) => {
      data.tickets.forEach((item) => {
        this.ticketsList.push({
          logTime: item.createdDate,
          requestID: item.requestID,
          comment: item.comments,
          duration: item.duration,
          frequency: item.freq,
          natureOfTicket: item.nature,
          noOfResourcesNeedAvailable: item.noOfResourcesNA,
          noOfResourcesConsumed: item.noOfResourcesC,
          noOfResourcesRemaining: item.noOfResourcesR,
          poc: item.poc,
          resource: item.resource,
          status: item.state,
          volunteer: item.volunteer,
          priority: (item.priority || '').toUpperCase(),
          ticketID: item.ticketNo,
          location: item.location || '',
        });
      });
      this.dataSource.data = this.ticketsList;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.selectedTabIndex = 0;
      this.selection.clear();
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
  checkboxLabel(row?: TicketElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.requestID + 1
    }`;
  }
  onClickTableCell(row) {
    const dialogRef = this.dialog.open(TicketDetailsComponent, {
      width: '1200px',
      data: {
        ticketID: row.ticketID
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  updateTicketType() {
    this.getTicketsList('', this.natureOfTickets);
  }
  updateStatusTypes(ev: any) {
    const body = { state: ev.value, IDs: [] };
    if (this.selection.selected.length > 0) {
      this.selection.selected.forEach((item) => {
        body.IDs.push(item.ticketID);
      });
      this.api.updateTicketsStatus(body).subscribe((data) => {
        Swal.fire({
          title: 'Ticket(s) status updated',
          icon: 'success',
        });
        this.getTicketsList('', this.natureOfTickets);
      });
    } else {
      Swal.fire({
        title: 'No tickets selected',
        icon: 'warning',
      });
    }
  }
  selectedTabChange(index: any) {
    // ev.index 0: all, 1: pending, 2: progress, 3: resolved, 4: unresolved
    switch (index) {
      case 0:
        this.dataSource.data = this.ticketsList;
        break;
      case 1:
        this.dataSource.data = this.ticketsList.filter(
          (item) => item.status === 'Open'
        );
        break;
      case 2:
        this.dataSource.data = this.ticketsList.filter(
          (item) => item.status === 'Closed'
        );
        break;
      case 3:
        this.dataSource.data = this.ticketsList.filter(
          (item) => item.status === 'Blocked'
        );
        break;
      case 4:
        this.dataSource.data = this.ticketsList.filter(
          (item) => item.status === 'Can’t Fix'
        );
        break;
      case 5:
        this.dataSource.data = this.ticketsList.filter(
          (item) => item.status === 'Standby'
        );
        break;
    }
    this.dataSource.paginator = this.paginator;
    this.selection.clear();
  }
  updateTicketTypeWithButton(ev) {
    // debugger;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
