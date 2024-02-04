import { TestBed } from '@angular/core/testing';

import { SuperadminApiService } from './superadmin-api.service';

describe('SuperadminApiService', () => {
  let service: SuperadminApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperadminApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
