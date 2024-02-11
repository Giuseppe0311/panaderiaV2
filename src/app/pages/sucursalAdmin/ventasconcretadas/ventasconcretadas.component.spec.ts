import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasconcretadasComponent } from './ventasconcretadas.component';

describe('VentasconcretadasComponent', () => {
  let component: VentasconcretadasComponent;
  let fixture: ComponentFixture<VentasconcretadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasconcretadasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VentasconcretadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
