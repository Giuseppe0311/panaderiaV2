import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosucursaladminComponent } from './usuariosucursaladmin.component';

describe('UsuariosucursaladminComponent', () => {
  let component: UsuariosucursaladminComponent;
  let fixture: ComponentFixture<UsuariosucursaladminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosucursaladminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsuariosucursaladminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
