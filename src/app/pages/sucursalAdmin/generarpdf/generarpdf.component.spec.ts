import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarpdfComponent } from './generarpdf.component';

describe('GenerarpdfComponent', () => {
  let component: GenerarpdfComponent;
  let fixture: ComponentFixture<GenerarpdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarpdfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerarpdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
