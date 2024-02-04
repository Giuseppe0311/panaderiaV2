import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorypageComponent } from './categorypage.component';

describe('CategorypageComponent', () => {
  let component: CategorypageComponent;
  let fixture: ComponentFixture<CategorypageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorypageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategorypageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
