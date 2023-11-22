import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserLogin, UserRegister } from '../models/user.models';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
  
})
export class UserApiService {
  private httpClient = inject(HttpClient);

  private apiUrl: string = environment.apiUrl;


  public getHello(): Observable<any> {
    return this.httpClient.get(this.apiUrl + '/', {withCredentials: true}) as Observable<any>;
  }

  public getPub(): Observable<any> {
    return this.httpClient.get(this.apiUrl + '/pub', {withCredentials: true}) as Observable<any>;
  }

  public getLogin(): Observable<any> {
    return this.httpClient.get(this.apiUrl + '/auth/login', {withCredentials: true}) as Observable<any>;
  }
  public getLogout(): Observable<any> {
    return this.httpClient.get(this.apiUrl + '/auth/logout', {withCredentials: true}) as Observable<any>;
  }

  public getAllUsers(): Observable<any> {
    return this.httpClient.get(this.apiUrl + '/user/all') as Observable<any>;
  }

  public registerUser(registerBody: UserRegister): Observable<any> {
    return this.httpClient.post(this.apiUrl + '/user/register_user', registerBody) as Observable<any>;
  }


  public authenticateUser(loginBody: UserLogin): Observable<any> {
    return this.httpClient.post(this.apiUrl + '/user/login_user', loginBody) as Observable<any>;
  }
}
