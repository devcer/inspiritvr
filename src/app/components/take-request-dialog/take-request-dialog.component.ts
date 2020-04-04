import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RequestElement } from 'src/app/pages/requests/requests.component';

@Component({
  selector: 'app-take-request-dialog',
  templateUrl: './take-request-dialog.component.html',
  styleUrls: ['./take-request-dialog.component.scss']
})
export class TakeRequestDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TakeRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestElement) { }

  ngOnInit(): void {
  }
  onClickCancel(): void {
    this.dialogRef.close();
  }
}
