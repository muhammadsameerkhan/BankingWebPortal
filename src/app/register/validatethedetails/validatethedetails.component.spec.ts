import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatethedetailsComponent } from './validatethedetails.component';

describe('ValidatethedetailsComponent', () => {
  let component: ValidatethedetailsComponent;
  let fixture: ComponentFixture<ValidatethedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidatethedetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatethedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
