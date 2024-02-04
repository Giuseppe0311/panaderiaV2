import { TestBed } from '@angular/core/testing';

import { AdminempresaApiService } from './adminempresa-api.service';

describe('AdminempresaApiService', () => {
  let service: AdminempresaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminempresaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
