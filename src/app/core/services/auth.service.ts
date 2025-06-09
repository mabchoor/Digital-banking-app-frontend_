import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    roles: string[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
  }

  private handleError(error: any) {
    let errorMessage: string;

    console.error('Auth Service - Raw error:', error);

    try {
      if (error?.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${
          error.error.message || 'An unknown client-side error occurred.'
        }`;
      } else if (error?.status !== undefined) {
        // HTTP error response
        if (error.status === 0) {
          errorMessage =
            'Cannot connect to the backend server. Please ensure your backend is running.';
        } else if (error.status === 401) {
          errorMessage =
            'Invalid credentials. Please check your username and password.';
        } else if (error.status === 403) {
          errorMessage = 'Access denied. You do not have permission.';
        } else if (error.status >= 500) {
          errorMessage = 'A server error occurred. Please try again later.';
        } else {
          // Attempt to get a more specific message from the error object
          const serverErrorMessage = error.error?.message || error.message;
          errorMessage = `HTTP Error ${error.status}: ${
            serverErrorMessage || error.statusText || 'Unknown error'
          }`;
        }
      } else if (typeof error === 'string') {
        errorMessage = `Error: ${error}`;
      } else if (error?.message) {
        // Generic error with message property
        errorMessage = `Error: ${error.message}`;
      } else {
        // Fallback for completely unexpected error structures
        errorMessage = 'An unexpected error occurred with no specific message.';
      }
    } catch (parseError) {
      console.error('Error parsing error object in handleError:', parseError);
      errorMessage =
        'An unexpected error occurred during error processing in handleError.';
    }

    console.error('Auth Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    const url = `${this.API_URL}/auth/register`;
    console.log('Making registration request to:', url);
    return this.http
      .post<AuthResponse>(url, userData, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((response) => console.log('Registration response:', response)),
        catchError(this.handleError)
      );
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    const url = `${this.API_URL}/auth/login`;
    console.log('Making login request to:', url);
    return this.http
      .post<AuthResponse>(url, credentials, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          console.log('Login response:', response);
          this.handleAuthResponse(response);
        }),
        catchError(this.handleError)
      );
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (response && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}
