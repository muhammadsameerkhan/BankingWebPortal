import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachBoxComponent } from './attach-box.component';

describe('AttachBoxComponent', () => {
  let component: AttachBoxComponent;
  let fixture: ComponentFixture<AttachBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
