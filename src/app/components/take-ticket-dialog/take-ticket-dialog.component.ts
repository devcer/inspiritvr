import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TakeRequestDialogComponent } from '../take-request-dialog/take-request-dialog.component';
import { formFields } from 'src/app/data/formFields';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import Swal from 'sweetalert2';
import { TicketElement, Person } from 'src/app/pages/requests/requests.component';


@Component({
  selector: 'app-take-ticket-dialog',
  templateUrl: './take-ticket-dialog.component.html',
  styleUrls: ['./take-ticket-dialog.component.scss'],
})
export class TakeTicketDialogComponent implements OnInit {
  resources = formFields.resources;
  frequencies = formFields.frequencies;
  statuses = formFields.status;
  partyList = formFields.parties;
  ticketForm = this.fb.group({
    natureOfTicket: ['give', Validators.required],
    resource: ['', Validators.required],
    noOfResourcesNeedAvailable: ['', Validators.required],
    duration: [1, [Validators.required, Validators.min(1)]],
    frequency: ['Daily', Validators.required],
    location: ['', Validators.required],
    poc: this.fb.group({
      name: ['', Validators.required],
      organization: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      email: ['', Validators.email],
      location: ['', Validators.required],
      party: ['NGO', Validators.required],
    }),
    comment: [''],
    volunteer: this.fb.group({
      name: ['', Validators.required],
      organization: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      location: ['', Validators.required],
    }),
  });
  tickets = []
  constructor(
    public dialogRef: MatDialogRef<TakeRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.getTicketsList();
  }
  getTicketsList() {
    this.api.getTicketsList(this.data.requestID).subscribe(data => {
      this.tickets = data.tickets
    });
  }
  onClickCancel(): void {
    this.dialogRef.close();
  }
  getForm(): void {
    debugger;
  }
  onClickCreate() {
    const ticketData = this.ticketForm.value; 
    const requestObj = {
      requestID: this.data.requestID,
      natureOfTicket: ticketData.natureOfTicket,
      resource: ticketData.resource,
      noOfResourcesNeedAvailable: ticketData.noOfResourcesNeedAvailable,
      duration: ticketData.duration,
      frequency: ticketData.frequency,
      location: ticketData.location,
      poc: ticketData.poc.name,
      volunteer: ticketData.volunteer.name,
      comment: ticketData.comment
    };
    this.createUser({...ticketData.poc}, 'user');
    this.createUser({...ticketData.volunteer}, 'volunteer');
    this.createTicket(requestObj);
  }
  createTicket(requestObj) {
    this.api.createTicket(requestObj).subscribe(
      (data) => {
        this.ticketForm.reset();
        this.getTicketsList();
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
  createUser(userDetails: Person, type: 'user' | 'volunteer') {
    this.api.createUser(userDetails, type).subscribe((data) => {
      console.log(`User created successfully ${JSON.stringify(userDetails)}`);
    });
  }
}
