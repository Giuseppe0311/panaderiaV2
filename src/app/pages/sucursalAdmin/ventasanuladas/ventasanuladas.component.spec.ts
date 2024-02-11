import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasanuladasComponent } from './ventasanuladas.component';

describe('VentasanuladasComponent', () => {
  let component: VentasanuladasComponent;
  let fixture: ComponentFixture<VentasanuladasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasanuladasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VentasanuladasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
