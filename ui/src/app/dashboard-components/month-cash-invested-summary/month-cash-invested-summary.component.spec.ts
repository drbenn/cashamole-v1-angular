import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthCashInvestedSummaryComponent } from './month-cash-invested-summary.component';

describe('MonthCashInvestedSummaryComponent', () => {
  let component: MonthCashInvestedSummaryComponent;
  let fixture: ComponentFixture<MonthCashInvestedSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthCashInvestedSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthCashInvestedSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
