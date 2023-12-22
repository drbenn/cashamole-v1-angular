import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Chip } from '../../model/chips.model';
import { BalanceSheetEntry, Expense, Income } from '../../model/core.model';


@Injectable({
  providedIn: 'root'
})
export class CoreApiService {
  private apiUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // ===================== INCOME API CALLS ======================

  public submitNewIncomeRecord(incomeBody: Income): Observable<Income> {
    return this.httpClient.post(this.apiUrl + '/income', incomeBody, {withCredentials: true}) as Observable<Income>;
  };

  public submitUpdatedIncomeRecord(incomeBody: Income): Observable<Income> {    
    return this.httpClient.patch(this.apiUrl + '/income', incomeBody, {withCredentials: true}) as Observable<Income>;
  };

  public deactivateIncomeRecord(record_id: number): Observable<any> {  
    const requestBody: {inc_id: number} = {inc_id: record_id};
    return this.httpClient.patch(this.apiUrl + `/income/deactivate`, requestBody, {withCredentials: true}) as Observable<any>;
  };



  // ===================== EXPENSE API CALLS ======================

  public submitNewExpenseRecord(expenseBody: Expense): Observable<Expense> {
    return this.httpClient.post(this.apiUrl + '/expense', expenseBody, {withCredentials: true}) as Observable<Expense>;
  };

  public submitUpdatedExpenseRecord(expenseBody: Expense): Observable<Expense> {    
    return this.httpClient.patch(this.apiUrl + '/expense', expenseBody, {withCredentials: true}) as Observable<Expense>;
  };

  public deactivatExpenseRecord(record_id: number): Observable<any> {    
    const requestBody: {exp_id: number} = {exp_id: record_id};
    return this.httpClient.patch(this.apiUrl + `/expense/deactivate`, requestBody, {withCredentials: true}) as Observable<any>;
  };


  // ===================== BALANCE SHEET API CALLS ======================

  public submitNewBsRecord(balanceSheetEntryBody: BalanceSheetEntry): Observable<BalanceSheetEntry> {    
    return this.httpClient.post(this.apiUrl + '/balance-sheet', balanceSheetEntryBody, {withCredentials: true}) as Observable<BalanceSheetEntry>;
  };

  public submitUpdatedBsRecord(balanceSheetEntryBody: BalanceSheetEntry): Observable<BalanceSheetEntry> {    
    return this.httpClient.patch(this.apiUrl + '/balance-sheet', balanceSheetEntryBody, {withCredentials: true}) as Observable<BalanceSheetEntry>;
  };

  public deactivateBsRecord(record_id: number): Observable<any> {    
    const requestBody: {record_id: number} = {record_id: record_id};
    return this.httpClient.patch(this.apiUrl + `/balance-sheet/deactivate`, requestBody, {withCredentials: true}) as Observable<any>;
  };



  // ===================== CHIP API CALLS ======================

  public submitNewChip(chipBody: Chip): Observable<Chip> {    
    return this.httpClient.post(this.apiUrl + '/chip', chipBody, {withCredentials: true}) as Observable<any>;
  };

  public deleteChip(chipBody: Chip): Observable<Chip> {    
    return this.httpClient.post(this.apiUrl + '/chip/delete', chipBody, {withCredentials: true}) as Observable<any>;
  };
}
