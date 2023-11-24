import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { TransactionBody } from '../models/transaction.model';


@Injectable({
  providedIn: 'root'
})
export class CoreApiService {
  private httpClient = inject(HttpClient);

  private apiUrl: string = environment.apiUrl;

  constructor() { }

  public submitNewTransaction(transactionBody: TransactionBody): Observable<any> {
    console.log(transactionBody);
    
    return this.httpClient.post(this.apiUrl + '/transaction', transactionBody, {withCredentials: true}) as Observable<any>;
  }
}
