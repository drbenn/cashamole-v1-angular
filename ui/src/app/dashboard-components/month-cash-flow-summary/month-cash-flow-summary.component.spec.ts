import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthCashFlowSummaryComponent } from './month-cash-flow-summary.component';

describe('MonthCashFlowSummaryComponent', () => {
  let component: MonthCashFlowSummaryComponent;
  let fixture: ComponentFixture<MonthCashFlowSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthCashFlowSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthCashFlowSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
