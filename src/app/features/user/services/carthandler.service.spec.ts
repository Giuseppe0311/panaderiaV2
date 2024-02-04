import { TestBed } from '@angular/core/testing';

import { CarthandlerService } from './carthandler.service';

describe('CarthandlerService', () => {
  let service: CarthandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarthandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
