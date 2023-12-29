import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthNetCashFlowBannerComponent } from './month-net-cash-flow-banner.component';

describe('MonthNetCashFlowBannerComponent', () => {
  let component: MonthNetCashFlowBannerComponent;
  let fixture: ComponentFixture<MonthNetCashFlowBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthNetCashFlowBannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthNetCashFlowBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
