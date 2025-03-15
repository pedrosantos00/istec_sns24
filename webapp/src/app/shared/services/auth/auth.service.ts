import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../../environments/environment';
import { UserRegisterDto } from '../../interfaces/auth/userRegisterDto';
import { UserLoginDto } from '../../interfaces/auth/userLoginDto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Users/register`, user);
  }

  login(user: UserLoginDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/Users/login`, user);
  }

  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  confirmEmail(email: string, token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/account/confirmation`, {
      headers: {
        email: email,
        token: token,
      },
    });
  }

  resendConfirmationEmail(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/account/confirmation`, {
      email: email,
    });
  }
}
