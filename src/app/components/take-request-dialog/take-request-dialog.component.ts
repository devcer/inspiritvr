import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formFields } from 'src/app/data/formFields';
import { ApiService } from 'src/app/services/api/api.service';
import { Person } from 'src/app/pages/requests/requests.component';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

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
  requestForm = this.fb.group({
    details: [''],
    channel: ['', Validators.required],
    priority: ['', Validators.required],
    volunteer: this.fb.group({
      name: ['', Validators.required],
      organization: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      location: ['', Validators.required],
    }),
    poc: this.fb.group({
      name: ['', Validators.required],
      organization: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern("[0-9]{10}")]],
      email: ['', Validators.email],
      location: ['', Validators.required],
      party: ['NGO', Validators.required],
    }),
    refPoc: this.fb.group({
      name: [''],
      organization: [''],
      phone: [''],
      email: ['', Validators.email],
      location: [''],
      party: ['NGO'],
    })
  });
  constructor(public dialogRef: MatDialogRef<TakeRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private api: ApiService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.api.getUsersList('user').subscribe(data => {
      this.usersList = data.people;
    });
  }
  onClickCancel(): void {
    this.dialogRef.close();
  }
  getForm(): void {
    debugger;
  }
}
