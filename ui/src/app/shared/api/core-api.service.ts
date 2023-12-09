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

  public submitNewIncome(incomeBody: Income): Observable<any> {
    return this.httpClient.post(this.apiUrl + '/income', incomeBody, {withCredentials: true}) as Observable<any>;
  };

  public submitNewExpense(expenseBody: Expense): Observable<any> {
    return this.httpClient.post(this.apiUrl + '/expense', expenseBody, {withCredentials: true}) as Observable<any>;
  };

  public submitNewBsRecord(balanceSheetEntryBody: BalanceSheetEntry): Observable<any> {    
    return this.httpClient.post(this.apiUrl + '/balance-sheet', balanceSheetEntryBody, {withCredentials: true}) as Observable<any>;
  };

  public submitNewChip(chipBody: Chip): Observable<any> {    
    return this.httpClient.post(this.apiUrl + '/chip', chipBody, {withCredentials: true}) as Observable<any>;
  };

  public deleteChip(chipBody: Chip): Observable<any> {    
    return this.httpClient.post(this.apiUrl + '/chip/delete', chipBody, {withCredentials: true}) as Observable<any>;
  };
}
