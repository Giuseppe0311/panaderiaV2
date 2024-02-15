import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankspageComponent } from './thankspage.component';

describe('ThankspageComponent', () => {
  let component: ThankspageComponent;
  let fixture: ComponentFixture<ThankspageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThankspageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThankspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
