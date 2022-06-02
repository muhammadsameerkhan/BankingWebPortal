import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForeignInformationComponent } from './foreign-information.component';

describe('ForeignInformationComponent', () => {
  let component: ForeignInformationComponent;
  let fixture: ComponentFixture<ForeignInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForeignInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForeignInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
