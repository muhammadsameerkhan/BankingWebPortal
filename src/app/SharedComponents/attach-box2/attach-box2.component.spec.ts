import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachBox2Component } from './attach-box2.component';

describe('AttachBox2Component', () => {
  let component: AttachBox2Component;
  let fixture: ComponentFixture<AttachBox2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttachBox2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachBox2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
