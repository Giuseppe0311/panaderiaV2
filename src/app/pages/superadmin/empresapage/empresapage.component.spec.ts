import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresapageComponent } from './empresapage.component';

describe('EmpresapageComponent', () => {
  let component: EmpresapageComponent;
  let fixture: ComponentFixture<EmpresapageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresapageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmpresapageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
