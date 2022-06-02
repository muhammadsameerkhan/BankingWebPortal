import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TellUsMoreAboutYourself1Component } from './tell-us-more-about-yourself1.component';

describe('TellUsMoreAboutYourself1Component', () => {
  let component: TellUsMoreAboutYourself1Component;
  let fixture: ComponentFixture<TellUsMoreAboutYourself1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TellUsMoreAboutYourself1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TellUsMoreAboutYourself1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
