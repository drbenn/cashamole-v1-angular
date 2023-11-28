import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { TransactionBody } from '../../model/transaction.model';
import { BalanceSheetEntryBody } from '../../model/balanceSheet.model';
import { Chip } from '../../model/chips.model';


@Injectable({
  providedIn: 'root'
})
export class CoreApiService {
  private httpClient = inject(HttpClient);

  private apiUrl: string = environment.apiUrl;

  constructor() { }

  public submitNewTransaction(transactionBody: TransactionBody): Observable<any> {
    return this.httpClient.post(this.apiUrl + '/transaction', transactionBody, {withCredentials: true}) as Observable<any>;
  };

  public submitNewBsRecord(balanceSheetEntryBody: BalanceSheetEntryBody): Observable<any> {    
    return this.httpClient.post(this.apiUrl + '/balance-sheet', balanceSheetEntryBody, {withCredentials: true}) as Observable<any>;
  }

  public submitNewChip(chipBody: Chip): Observable<any> {    
    return this.httpClient.post(this.apiUrl + '/chip', chipBody, {withCredentials: true}) as Observable<any>;
  }

  public deleteChip(chipBody: Chip): Observable<any> {    
    return this.httpClient.post(this.apiUrl + '/chip/delete', chipBody, {withCredentials: true}) as Observable<any>;
  }
}
