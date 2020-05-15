import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TakeRequestDialogComponent } from '../take-request-dialog/take-request-dialog.component';
import { formFields } from 'src/app/data/formFields';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import Swal from 'sweetalert2';
import {
  Person,
} from 'src/app/pages/requests/requests.component';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';

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
    volunteer: this.fb.group({
      name: ['', Validators.required],
      organization: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      location: ['', Validators.required],
    }),
    comment: [''],
  });
  tickets = [];
  usersList: Person[] = [];
  volunteersList: Person[] = [];
  filteredUsersList: Observable<Person[]>;
  filteredVolunteersList: Observable<Person[]>;
  showCreateTicketForm = false;
  requestDetails: any;
  constructor(
    public dialogRef: MatDialogRef<TakeRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.getUsersList();
    this.getVolunteersList();
    this.getTicketsList();
    this.getRequestDetails();
    this.filteredUsersList = this.ticketForm.controls.poc
      .get('name')
      .valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) =>
          name ? this._filter(name, 'user') : this.usersList.slice()
        )
      );
    this.filteredVolunteersList = this.ticketForm.controls.volunteer
      .get('name')
      .valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) =>
          name ? this._filter(name, 'volunteer') : this.volunteersList.slice()
        )
      );
  }
  getTicketsList() {
    this.api.getTicketsList(this.data.requestID).subscribe((data) => {
      this.tickets = data.tickets;
    });
  }
  getUsersList() {
    this.api.getUsersList('user').subscribe((data) => {
      this.usersList = [...data.people];
    });
  }
  getVolunteersList() {
    this.api.getUsersList('volunteer').subscribe((data) => {
      this.volunteersList = data.volunteer;
    });
  }
  getRequestDetails() {
    this.api.getRequestDetailsByID(this.data.requestID).subscribe(
      (data) => {
        this.requestDetails = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  onClickCancel(): void {
    this.dialogRef.close();
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
      comment: ticketData.comment,
      volunteer: ticketData.volunteer.name
    };
    this.createUser({ ...ticketData.poc }, 'user');
    this.createUser({ ...ticketData.volunteer }, 'volunteer');
    this.createTicket(requestObj);
  }
  createTicket(requestObj) {
    this.api.createTicket(requestObj).subscribe(
      (data) => {
        this.ticketForm.reset();
        this.getTicketsList();
        this.getUsersList();
        this.getVolunteersList();
        Swal.fire({
          title: 'Ticket creation successful',
          icon: 'success',
        });
        this.showCreateTicketForm = false;
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
  _filter(name: string, type: string): Person[] {
    const filterValue = name.toLowerCase();
    switch (type) {
      case 'user':
        return this.usersList.filter(
          (option) => option.name.toLowerCase().indexOf(filterValue) === 0
        );
      case 'volunteer':
        return this.volunteersList.filter(
          (option) => option.name.toLowerCase().indexOf(filterValue) === 0
        );
    }
  }
  optionSelected(value: string, type: string) {
    // ev.option.value
    let user: any = {};
    const filterValue = value.toLowerCase();
    switch (type) {
      case 'user':
        user = this.usersList.filter(
          (option) => option.name.toLowerCase() === filterValue
        )[0];
        delete user.creation_date;
        this.ticketForm.controls.poc.setValue(user);
        break;
      case 'volunteer':
        user = this.volunteersList.filter(
          (option) => option.name.toLowerCase() === filterValue
        )[0];
        delete user.creation_date;
        this.ticketForm.controls.volunteer.setValue(user);
        break;
    }
  }
  onClickCreateNewTicket() {
    this.showCreateTicketForm = true;
  }
}
