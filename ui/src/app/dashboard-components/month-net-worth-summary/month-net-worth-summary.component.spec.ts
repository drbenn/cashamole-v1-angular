import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthNetWorthSummaryComponent } from './month-net-worth-summary.component';

describe('MonthNetWorthSummaryComponent', () => {
  let component: MonthNetWorthSummaryComponent;
  let fixture: ComponentFixture<MonthNetWorthSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthNetWorthSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthNetWorthSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
