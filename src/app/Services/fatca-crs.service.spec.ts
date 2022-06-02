import { TestBed } from '@angular/core/testing';

import { FatcaCrsService } from './fatca-crs.service';

describe('FatcaCrsService', () => {
  let service: FatcaCrsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FatcaCrsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
