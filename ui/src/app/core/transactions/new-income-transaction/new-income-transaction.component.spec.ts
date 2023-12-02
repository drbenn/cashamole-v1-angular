import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIncomeTransactionComponent } from './new-income-transaction.component';

describe('NewIncomeTransactionComponent', () => {
  let component: NewIncomeTransactionComponent;
  let fixture: ComponentFixture<NewIncomeTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewIncomeTransactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewIncomeTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
