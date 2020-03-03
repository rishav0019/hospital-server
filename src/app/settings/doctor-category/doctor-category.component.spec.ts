import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCategoryComponent } from './doctor-category.component';

describe('DoctorCategoryComponent', () => {
  let component: DoctorCategoryComponent;
  let fixture: ComponentFixture<DoctorCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
