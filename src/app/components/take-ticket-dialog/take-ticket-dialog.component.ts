import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TakeRequestDialogComponent } from '../take-request-dialog/take-request-dialog.component';
import { formFields } from 'src/app/data/formFields';

@Component({
  selector: 'app-take-ticket-dialog',
  templateUrl: './take-ticket-dialog.component.html',
  styleUrls: ['./take-ticket-dialog.component.scss']
})
export class TakeTicketDialogComponent implements OnInit {
  resources = formFields.resources;
  frequencies = formFields.frequencies;
  statuses = formFields.status;
  constructor(public dialogRef: MatDialogRef<TakeRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  onClickCancel(): void {
    this.dialogRef.close();
  }
}
