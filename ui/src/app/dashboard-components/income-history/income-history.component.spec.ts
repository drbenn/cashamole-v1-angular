import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeHistoryComponent } from './income-history.component';

describe('IncomeHistoryComponent', () => {
  let component: IncomeHistoryComponent;
  let fixture: ComponentFixture<IncomeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncomeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
