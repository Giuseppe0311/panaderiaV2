import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarUsuariosSucursalAdminComponent } from './registar-usuarios-sucursal-admin.component';

describe('RegistarUsuariosSucursalAdminComponent', () => {
  let component: RegistarUsuariosSucursalAdminComponent;
  let fixture: ComponentFixture<RegistarUsuariosSucursalAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistarUsuariosSucursalAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistarUsuariosSucursalAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
