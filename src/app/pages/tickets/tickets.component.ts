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

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
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
    'location'
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  natureOfTickets = 'give';
  statusTypes = formFields.status;
  constructor(public dialog: MatDialog,
    private data: DataService,
    private api: ApiService) { }

  ngOnInit(): void {
    // this.data.currentRequest.subscribe((data) => {
    //   if (data === '') this.openDialog();
    // });
    this.getTicketsList('', this.natureOfTickets);
  }
  getTicketsList(ticketID = '', natureOfTicket = ''): void {
    this.dataSource.data = [];
    this.api.getTicketsList(ticketID, natureOfTicket).subscribe(data => {
      data.tickets.forEach((item) => {
        this.dataSource.data.push({
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
          location: item.location || ''
        });
        this.dataSource.paginator = this.paginator;
      });
      this.dataSource.paginator = this.paginator;
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
  }
  updateTicketType(){
    this.getTicketsList('', this.natureOfTickets);
  }
  updateStatusTypes(ev: any) {
    const body = {state: ev.value, IDs: []};
    this.selection.selected.forEach(item => {
      body.IDs.push(item.ticketID);
    });
    this.api.updateTicketsStatus(body).subscribe(data => {
      Swal.fire({
        title: 'Ticket(s) status updated',
        icon: 'success',
      });
      this.getTicketsList('', this.natureOfTickets);
    });
  }
}
