import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExpenseTransactionComponent } from './new-expense-transaction.component';

describe('NewExpenseTransactionComponent', () => {
  let component: NewExpenseTransactionComponent;
  let fixture: ComponentFixture<NewExpenseTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewExpenseTransactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewExpenseTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
