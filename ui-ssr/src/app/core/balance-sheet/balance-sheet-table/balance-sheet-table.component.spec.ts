import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceSheetTableComponent } from './BalanceSheetTableComponent';

describe('BalanceSheetTableComponent', () => {
  let component: BalanceSheetTableComponent;
  let fixture: ComponentFixture<BalanceSheetTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceSheetTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BalanceSheetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
