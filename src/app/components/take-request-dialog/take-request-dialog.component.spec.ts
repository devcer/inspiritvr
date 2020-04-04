import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeRequestDialogComponent } from './take-request-dialog.component';

describe('TakeRequestDialogComponent', () => {
  let component: TakeRequestDialogComponent;
  let fixture: ComponentFixture<TakeRequestDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeRequestDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
