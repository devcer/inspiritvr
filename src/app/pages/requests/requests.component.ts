import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TakeRequestDialogComponent } from 'src/app/components/take-request-dialog/take-request-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  timePeriods = ['Today', '3 Days', 'Week', 'Month'];
  selectedTimePeriod = 'Today';
  ELEMENT_DATA: RequestElement[] = [
    {logTime: '02/04/2020', requestID: 'Hydrogen', details: 'Need 1000 packet of food for the daily waged located 10KM away from Bolaram, Hyderabad', poc: 'Raj Kumar N', refPoc: 'Rupesh Yadav', channel: 'phone', volunteer: 'Sanjay', priority: 'HIGH'},
    {logTime: '02/04/2020', requestID: 'Helium', details: 'Need 1000 packet of food for the daily waged located 10KM away from Bolaram, Hyderabad', poc: 'Raj Kumar N', refPoc: 'Rupesh Yadav', channel: 'phone', volunteer: 'Sanjay', priority: 'HIGH'},
    {logTime: '02/04/2020', requestID: 'Lithium', details: 'Need 1000 packet of food for the daily waged located 10KM away from Bolaram, Hyderabad', poc: 'Raj Kumar N', refPoc: 'Rupesh Yadav', channel: 'phone', volunteer: 'Sanjay', priority: 'HIGH'},
    {logTime: '02/04/2020', requestID: 'Beryllium', details: 'Need 1000 packet of food for the daily waged located 10KM away from Bolaram, Hyderabad', poc: 'Raj Kumar N', refPoc: 'Rupesh Yadav', channel: 'phone', volunteer: 'Sanjay', priority: 'HIGH'},
    {logTime: '02/04/2020', requestID: 'Boron', details: 'Need 1000 packet of food for the daily waged located 10KM away from Bolaram, Hyderabad', poc: 'Raj Kumar N', refPoc: 'Rupesh Yadav', channel: 'phone', volunteer: 'Sanjay', priority: 'HIGH'},
    {logTime: '02/04/2020', requestID: 'Carbon', details: 'Need 1000 packet of food for the daily waged located 10KM away from Bolaram, Hyderabad', poc: 'Raj Kumar N', refPoc: 'Rupesh Yadav', channel: 'phone', volunteer: 'Sanjay', priority: 'HIGH'},
    {logTime: '02/04/2020', requestID: 'Nitrogen', details: 'Need 1000 packet of food for the daily waged located 10KM away from Bolaram, Hyderabad', poc: 'Raj Kumar N', refPoc: 'Rupesh Yadav', channel: 'phone', volunteer: 'Sanjay', priority: 'HIGH'},
    {logTime: '02/04/2020', requestID: 'Oxygen', details: 'Need 1000 packet of food for the daily waged located 10KM away from Bolaram, Hyderabad', poc: 'Raj Kumar N', refPoc: 'Rupesh Yadav', channel: 'phone', volunteer: 'Sanjay', priority: 'HIGH'},
    {logTime: '02/04/2020', requestID: 'Fluorine', details: 'Need 1000 packet of food for the daily waged located 10KM away from Bolaram, Hyderabad', poc: 'Raj Kumar N', refPoc: 'Rupesh Yadav', channel: 'phone', volunteer: 'Sanjay', priority: 'HIGH'},
    {logTime: '02/04/2020', requestID: 'Neon', details: 'Need 1000 packet of food for the daily waged located 10KM away from Bolaram, Hyderabad', poc: 'Raj Kumar N', refPoc: 'Rupesh Yadav', channel: 'phone', volunteer: 'Sanjay', priority: 'HIGH'},
  ];
  dataSource = new MatTableDataSource<RequestElement>(this.ELEMENT_DATA);
  displayedColumns: string[] = ['logTime', 'requestID', 'details', 'poc', 'refPoc', 'channel', 'volunteer', 'priority']
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(TakeRequestDialogComponent, {
      width: '600px',
      data: this.ELEMENT_DATA[0]
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger;
      console.log('The dialog was closed');
      // this.ELEMENT_DATA[0] = result;
    });
  }

}

export interface RequestElement {
  logTime: string;
  requestID: string;
  details: string;
  poc: string;
  refPoc?: string;
  channel?: string;
  channelValue?: string;
  volunteer?: string;
  priority?: 'HIGH' | 'MEDIUM' |'LOW'
}

