import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInvestTransactionComponent } from './new-invest-transaction.component';

describe('NewInvestTransactionComponent', () => {
  let component: NewInvestTransactionComponent;
  let fixture: ComponentFixture<NewInvestTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewInvestTransactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewInvestTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
