import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarCircleComponent } from './progress-bar-circle.component';

describe('ProgressBarCircleComponent', () => {
  let component: ProgressBarCircleComponent;
  let fixture: ComponentFixture<ProgressBarCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressBarCircleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressBarCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
