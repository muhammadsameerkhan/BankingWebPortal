import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourForeignBankDetailsComponent } from './your-foreign-bank-details.component';

describe('YourForeignBankDetailsComponent', () => {
  let component: YourForeignBankDetailsComponent;
  let fixture: ComponentFixture<YourForeignBankDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourForeignBankDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YourForeignBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
