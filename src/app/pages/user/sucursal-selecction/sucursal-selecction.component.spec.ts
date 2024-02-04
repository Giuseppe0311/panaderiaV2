import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalSelecctionComponent } from './sucursal-selecction.component';

describe('SucursalSelecctionComponent', () => {
  let component: SucursalSelecctionComponent;
  let fixture: ComponentFixture<SucursalSelecctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucursalSelecctionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SucursalSelecctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
