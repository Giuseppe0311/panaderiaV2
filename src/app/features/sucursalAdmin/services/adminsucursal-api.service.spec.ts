import { TestBed } from '@angular/core/testing';

import { AdminsucursalApiService } from './adminsucursal-api.service';

describe('AdminsucursalApiService', () => {
  let service: AdminsucursalApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminsucursalApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
