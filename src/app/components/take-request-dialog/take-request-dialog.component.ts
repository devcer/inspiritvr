import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formFields } from 'src/app/data/formFields';
import { ApiService } from 'src/app/services/api/api.service';
import { Person } from 'src/app/pages/requests/requests.component';

@Component({
  selector: 'app-take-request-dialog',
  templateUrl: './take-request-dialog.component.html',
  styleUrls: ['./take-request-dialog.component.scss']
})
export class TakeRequestDialogComponent implements OnInit {
  partyList = formFields.parties;
  channels = formFields.channels;
  priorities = formFields.priorities;
  usersList: Person[] = [];
  constructor(public dialogRef: MatDialogRef<TakeRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private api: ApiService) { }

  ngOnInit(): void {
    this.api.getUsersList('user').subscribe(data => {
      debugger;
      this.usersList = data.people;
    });
  }
  onClickCancel(): void {
    this.dialogRef.close();
  }
}
