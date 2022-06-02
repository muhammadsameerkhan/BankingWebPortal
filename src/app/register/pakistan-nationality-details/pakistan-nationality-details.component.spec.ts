import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PakistanNationalityDetailsComponent } from './pakistan-nationality-details.component';

describe('PakistanNationalityDetailsComponent', () => {
  let component: PakistanNationalityDetailsComponent;
  let fixture: ComponentFixture<PakistanNationalityDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PakistanNationalityDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PakistanNationalityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
