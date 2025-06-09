import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from '../models/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = '/api';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  constructor(private http: HttpClient) {}

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    console.log(
      'AuthService: Making register request to:',
      `${this.API_URL}/auth/register`
    );
    console.log('AuthService: Register data:', registerData);

    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/register`, registerData)
      .pipe(
        tap((response) => {
          console.log('AuthService: Register response received:', response);
          this.handleAuthResponse(response);
        }),
        catchError((error) => {
          console.error('AuthService: Register error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error,
            url: error.url,
          });
          throw error;
        })
      );
  }

  login(loginData: LoginRequest): Observable<AuthResponse> {
    console.log(
      'AuthService: Making login request to:',
      `${this.API_URL}/auth/login`
    );
    console.log('AuthService: Login data:', loginData);
    console.log('AuthService: Request method: POST');
    console.log(
      'AuthService: Request headers will include Content-Type: application/json'
    );

    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/login`, loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        tap((response) => {
          console.log('AuthService: Login response received:', response);
          this.handleAuthResponse(response);
        }),
        catchError((error) => {
          console.error('AuthService: Login error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error,
            url: error.url,
            headers: error.headers,
          });
          throw error;
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    // Store minimal user data since backend only returns token
    localStorage.setItem(
      this.USER_KEY,
      JSON.stringify({ authenticated: true })
    );
  }
}
