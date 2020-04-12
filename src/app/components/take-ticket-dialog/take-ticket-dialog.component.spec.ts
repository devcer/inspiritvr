import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeTicketDialogComponent } from './take-ticket-dialog.component';

describe('TakeTicketDialogComponent', () => {
  let component: TakeTicketDialogComponent;
  let fixture: ComponentFixture<TakeTicketDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeTicketDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeTicketDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
