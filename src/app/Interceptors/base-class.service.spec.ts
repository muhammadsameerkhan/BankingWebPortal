import { TestBed } from '@angular/core/testing';

import { BaseClassService } from './base-class.service';

describe('BaseClassService', () => {
  let service: BaseClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
