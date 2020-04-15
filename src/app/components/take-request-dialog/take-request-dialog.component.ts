import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formFields } from 'src/app/data/formFields';

@Component({
  selector: 'app-take-request-dialog',
  templateUrl: './take-request-dialog.component.html',
  styleUrls: ['./take-request-dialog.component.scss']
})
export class TakeRequestDialogComponent implements OnInit {
  partyList = formFields.parties;
  channels = formFields.channels;
  priorities = formFields.priorities;
  constructor(public dialogRef: MatDialogRef<TakeRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  onClickCancel(): void {
    this.dialogRef.close();
  }
}
