import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Chip } from '../../model/chips.model';
import { BalanceSheetEntry, Expense, Income, Invest } from '../../model/core.model';


@Injectable({
  providedIn: 'root'
})
export class CoreApiService {
  private apiUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // ===================== INCOME API CALLS ======================

  public getAllActiveIncomeRecords(): Observable<Income[]> {
    return this.httpClient.get(this.apiUrl + '/income', {withCredentials: true}) as Observable<Income[]>;
  };

  public getActiveIncomeRecordsByMonth(yearMonthId:string): Observable<Income[]> {
    return this.httpClient.get(this.apiUrl + `/income/${yearMonthId}`, {withCredentials: true}) as Observable<Income[]>;
  };

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


  // ===================== INVEST API CALLS ======================

  public getAllActiveInvestRecords(): Observable<Invest[]> {
    return this.httpClient.get(this.apiUrl + '/invest', {withCredentials: true}) as Observable<Invest[]>;
  };

  public getActiveInvestRecordsByMonth(yearMonthId:string): Observable<Invest[]> {
    return this.httpClient.get(this.apiUrl + `/invest/${yearMonthId}`, {withCredentials: true}) as Observable<Invest[]>;
  };

  public submitNewInvestRecord(investBody: Invest): Observable<Invest> {
    return this.httpClient.post(this.apiUrl + '/invest', investBody, {withCredentials: true}) as Observable<Invest>;
  };

  public submitUpdatedInvestRecord(investBody: Invest): Observable<Invest> {    
    return this.httpClient.patch(this.apiUrl + '/invest', investBody, {withCredentials: true}) as Observable<Invest>;
  };

  public deactivateInvestRecord(record_id: number): Observable<any> {  
    const requestBody: {inc_id: number} = {inc_id: record_id};
    return this.httpClient.patch(this.apiUrl + `/invest/deactivate`, requestBody, {withCredentials: true}) as Observable<any>;
  };
  



  // ===================== EXPENSE API CALLS ======================

  public getAllActiveExpenseRecords(): Observable<Expense[]> {
    return this.httpClient.get(this.apiUrl + '/expense', {withCredentials: true}) as Observable<Expense[]>;
  };

  public getActiveExpenseRecordsByMonth(yearMonthId:string): Observable<Expense[]> {
    return this.httpClient.get(this.apiUrl + `/expense/${yearMonthId}`, {withCredentials: true}) as Observable<Expense[]>;
  };

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

  public getAllActiveBalanceRecords(): Observable<BalanceSheetEntry[]> {
    return this.httpClient.get(this.apiUrl + '/balance-sheet', {withCredentials: true}) as Observable<BalanceSheetEntry[]>;
  };

  public getActiveBalanceRecordsByMonth(yearMonthId:string): Observable<BalanceSheetEntry[]> {
    return this.httpClient.get(this.apiUrl + `/balance-sheet/${yearMonthId}`, {withCredentials: true}) as Observable<BalanceSheetEntry[]>;
  };

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
