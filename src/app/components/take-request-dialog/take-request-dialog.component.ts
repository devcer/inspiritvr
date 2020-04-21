import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formFields } from 'src/app/data/formFields';
import { ApiService } from 'src/app/services/api/api.service';
import { Person } from 'src/app/pages/requests/requests.component';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-take-request-dialog',
  templateUrl: './take-request-dialog.component.html',
  styleUrls: ['./take-request-dialog.component.scss'],
})
export class TakeRequestDialogComponent implements OnInit {
  partyList = formFields.parties;
  channels = formFields.channels;
  priorities = formFields.priorities;
  usersList: Person[] = [];
  refUsersList: Person[] = [];
  volunteersList: Person[] = [];
  filteredUsersList: Observable<Person[]>;
  filteredRefUsersList: Observable<Person[]>;
  filteredVolunteersList: Observable<Person[]>;
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
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
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
    }),
  });
  constructor(
    public dialogRef: MatDialogRef<TakeRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.api.getUsersList('user').subscribe((data) => {
      this.usersList = [...data.people];
      this.refUsersList = [...data.people];
    });
    this.api.getUsersList('volunteer').subscribe((data) => {
      this.volunteersList = data.volunteer;
      console.log(this.volunteersList);
    });
    this.filteredUsersList = this.requestForm.controls.poc
      .get('name')
      .valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) =>
          name ? this._filter(name, 'user') : this.usersList.slice()
        )
      );
    this.filteredRefUsersList = this.requestForm.controls.refPoc
      .get('name')
      .valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) =>
          name ? this._filter(name, 'refUser') : this.refUsersList.slice()
        )
      );
    this.filteredVolunteersList = this.requestForm.controls.volunteer
      .get('name')
      .valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) =>
          name ? this._filter(name, 'volunteer') : this.volunteersList.slice()
        )
      );
  }
  onClickCancel(): void {
    this.dialogRef.close();
  }
  _filter(name: string, type: string): Person[] {
    const filterValue = name.toLowerCase();
    switch (type) {
      case 'user':
        return this.usersList.filter(
          (option) => option.name.toLowerCase().indexOf(filterValue) === 0
        );
      case 'refUser':
        return this.refUsersList.filter(
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
        this.requestForm.controls.poc.setValue(user);
        break;
      case 'refUser':
        user = this.usersList.filter(
          (option) => option.name.toLowerCase() === filterValue
        )[0];
        delete user.creation_date;
        this.requestForm.controls.refPoc.setValue(user);
        break;
      case 'volunteer':
        user = this.volunteersList.filter(
          (option) => option.name.toLowerCase() === filterValue
        )[0];
        delete user.creation_date;
        this.requestForm.controls.volunteer.setValue(user);
        break;
    }
  }
  onClickCreate() {
    const result = this.requestForm.value;
    if (typeof result !== 'undefined') {
      this.createRequest({
        details: result.details,
        channel: result.channel,
        priority: result.priority,
        poc: result.poc.name,
        refPoc: result.refPoc.name,
        volunteer: result.volunteer.name,
      });
      this.createUser(result.poc, 'user');
      if (result.refPoc.name !== '') {
        this.createUser(result.refPoc, 'user');
      }
      this.createUser(result.volunteer, 'volunteer');
    }
  }
  createRequest(requestObj) {
    this.api.createRequest(requestObj).subscribe(
      (data) => {
        Swal.fire({
          title: 'Request creation successful',
          icon: 'success',
        });
        this.dialogRef.close('reloadRequests');
      },
      (error) => {
        console.error(error.message || '');
        Swal.fire({
          title: 'Request creation failed',
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
