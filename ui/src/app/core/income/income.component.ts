import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewIncomeTransactionComponent } from './new-income-transaction/new-income-transaction.component';
import { IncomeTableComponent } from './income-table/income-table.component';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Income } from '../../model/core.model';
import { CalendarState } from '../../store/calendar/calendar.state';
import { DateRange } from '../../model/calendar.model';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule, NewIncomeTransactionComponent, IncomeTableComponent],
  templateUrl: './income.component.html',
  styleUrl: './income.component.scss'
})
export class IncomeComponent implements OnInit {
  @Select(CalendarState.activeMonthDateRange) activeMonthDateRange$!: Observable<DateRange>;
  activeMonthDateRange!: DateRange;
  protected income$: Observable<Income[]> = this.store.select((state) => state.income.income);
  protected allIncome!: Income[];
  protected activeMonthIncome!: Income[];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.activeMonthDateRange$.subscribe((dateRange: DateRange) => {
      if (dateRange) {
        this.activeMonthDateRange = dateRange;
      };
      if (dateRange && this.allIncome) {
        this.filterIncomeToActiveMonth(this.allIncome, this.activeMonthDateRange);
      };
    });
    this.income$.subscribe((income: Income[]) => {
      if (income) {
        this.allIncome = income;
      };
      if (income && this.activeMonthDateRange) {
        this.filterIncomeToActiveMonth(income, this.activeMonthDateRange);
      };
      // if (income) {
      //   this.income = income;
      // };
    });
  };

  private filterIncomeToActiveMonth(incomeEntries: Income[], dateRange: DateRange): void {   
    const monthIncome = incomeEntries.filter((income: Income) => {      
      return new Date(income.date) >= dateRange.startDate && new Date(income.date) <= dateRange.endDate;
    });
   this.activeMonthIncome = monthIncome;

  };

}
