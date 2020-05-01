import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailsComponent implements OnInit {
  ticketDetails: any;
  constructor(public dialogRef: MatDialogRef<TicketDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private api: ApiService) { }

  ngOnInit(): void {
    this.getTicketDetails();
  }
  getTicketDetails() {
    this.api.getTicketDetailsByID(this.data.ticketID).subscribe(data => {
      this.ticketDetails = data;
      console.log(data);
    });
  }
  closePopup() {
    this.dialogRef.close();
  }
}
