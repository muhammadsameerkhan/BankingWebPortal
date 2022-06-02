import { TestBed } from '@angular/core/testing';

import { FIDCardService } from './fidcard.service';

describe('FIDCardService', () => {
  let service: FIDCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FIDCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
