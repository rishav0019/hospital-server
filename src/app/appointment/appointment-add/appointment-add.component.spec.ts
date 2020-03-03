import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentAddComponent } from './appointment-add.component';

describe('AppointmentAddComponent', () => {
  let component: AppointmentAddComponent;
  let fixture: ComponentFixture<AppointmentAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});