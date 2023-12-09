import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseTableComponent } from './expense-table/expense-table.component';
import { NewExpenseTransactionComponent } from './new-expense-transaction/new-expense-transaction.component';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Expense } from '../../model/core.model';
import { DateRange } from '../../model/calendar.model';
import { CalendarState } from '../../store/calendar/calendar.state';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, ExpenseTableComponent, NewExpenseTransactionComponent],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.scss'
})
export class ExpenseComponent implements OnInit {
  @Select(CalendarState.activeMonthDateRange) activeMonthDateRange$!: Observable<DateRange>;
  activeMonthDateRange!: DateRange;
  protected expenses$: Observable<Expense[]> = this.store.select((state) => state.expense.expenses);
  protected allExpenses!: Expense[];
  private expenseCategorySet: Set<string> = new Set();
  protected expenseCategoryArray: string[] = [];
  protected expenseCategoryObject: any = {};

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.activeMonthDateRange$.subscribe((dateRange: DateRange) => {
      if (dateRange) {
        this.activeMonthDateRange = dateRange;
      };
      if (dateRange && this.allExpenses) {
        this.filterExpensesToActiveMonth(this.allExpenses, this.activeMonthDateRange);
      };
    });
    this.expenses$.subscribe((expenses: Expense[]) => {
      if (expenses) {
        this.allExpenses = expenses;
      };
      if (expenses && this.activeMonthDateRange) {
        this.filterExpensesToActiveMonth(expenses, this.activeMonthDateRange);
      };
    });
  };

  private filterExpensesToActiveMonth(expenses: Expense[], dateRange: DateRange): void {   
    const monthExpenses = expenses.filter((expense: Expense) => {      
      return new Date(expense.date) >= dateRange.startDate && new Date(expense.date) <= dateRange.endDate;
    });

    if (monthExpenses.length) {
      this.expenseCategoryObject = {};
      monthExpenses.forEach((expense: Expense) =>{
        this.expenseCategorySet.add(expense.category);
        this.expenseCategoryArray = Array.from(this.expenseCategorySet);
        if (!this.expenseCategoryObject[expense.category]) {
          this.expenseCategoryObject[expense.category] = [];
        } 
        this.expenseCategoryObject[expense.category].push(expense);
      },
        (error: any )=> console.log(error)
      )
    } else {
      this.expenseCategoryObject = {};
    };
  }; 
  
};


