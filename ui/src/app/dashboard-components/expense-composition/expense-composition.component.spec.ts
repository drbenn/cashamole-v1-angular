import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCompositionComponent } from './expense-composition.component';

describe('ExpenseCompositionComponent', () => {
  let component: ExpenseCompositionComponent;
  let fixture: ComponentFixture<ExpenseCompositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseCompositionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpenseCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
