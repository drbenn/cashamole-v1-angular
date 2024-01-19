import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetCashFlowTimeComponent } from './net-cash-flow-time.component';

describe('NetCashFlowTimeComponent', () => {
  let component: NetCashFlowTimeComponent;
  let fixture: ComponentFixture<NetCashFlowTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetCashFlowTimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NetCashFlowTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
