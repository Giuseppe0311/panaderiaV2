import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalAdminlayoutComponent } from './sucursal-adminlayout.component';

describe('SucursalAdminlayoutComponent', () => {
  let component: SucursalAdminlayoutComponent;
  let fixture: ComponentFixture<SucursalAdminlayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucursalAdminlayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SucursalAdminlayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
