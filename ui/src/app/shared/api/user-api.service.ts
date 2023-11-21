import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserLogin, UserRegister } from '../models/user.models';

@Injectable({
  providedIn: 'root',
  
})
export class UserApiService {
  private httpClient = inject(HttpClient);

  private port: number = 3300;
  private apiUrl: string = `http://localhost:${this.port}`;


  public registerUser(registerBody: UserRegister): Observable<any> {
    return this.httpClient.post(this.apiUrl + '/user/register_user', registerBody) as Observable<any>;
  }


  public authenticateUser(loginBody: UserLogin): Observable<any> {
    return this.httpClient.post(this.apiUrl + '/user/login_user', loginBody) as Observable<any>;
  }
}
