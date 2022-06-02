import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrsFatcaDeclarationComponent } from './crs-fatca-declaration.component';

describe('CrsFatcaDeclarationComponent', () => {
  let component: CrsFatcaDeclarationComponent;
  let fixture: ComponentFixture<CrsFatcaDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrsFatcaDeclarationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrsFatcaDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
