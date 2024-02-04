import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminempresalayoutComponent } from './adminempresalayout.component';

describe('AdminempresalayoutComponent', () => {
  let component: AdminempresalayoutComponent;
  let fixture: ComponentFixture<AdminempresalayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminempresalayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminempresalayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
