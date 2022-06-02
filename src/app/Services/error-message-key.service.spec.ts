import { TestBed } from '@angular/core/testing';

import { ErrorMessageKeyService } from './error-message-key.service';

describe('ErrorMessageKeyService', () => {
  let service: ErrorMessageKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorMessageKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
