import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarsucursalAdminComponent } from './navbarsucursal-admin.component';

describe('NavbarsucursalAdminComponent', () => {
  let component: NavbarsucursalAdminComponent;
  let fixture: ComponentFixture<NavbarsucursalAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarsucursalAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarsucursalAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
