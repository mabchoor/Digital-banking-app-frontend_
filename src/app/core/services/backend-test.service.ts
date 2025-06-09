import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BackendTestService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  testBackendConnectivity(): Observable<any> {
    console.log('🔍 Testing backend connectivity...');
    console.log('🌐 Backend URL:', this.API_URL);
    console.log('🔗 Testing endpoint:', `${this.API_URL}/customers`);
    
    return this.http.get(`${this.API_URL}/customers`);
  }

  testSwaggerEndpoint(): Observable<any> {
    console.log('🔍 Testing Swagger endpoint...');
    console.log('📚 Swagger URL:', environment.swaggerUrl);
    
    return this.http.get(environment.swaggerUrl);
  }

  testAuthEndpoint(): Observable<any> {
    console.log('🔍 Testing Auth endpoint...');
    console.log('🔐 Auth URL:', `${this.API_URL}/auth/login`);
    
    // Test with a simple GET to see if the endpoint exists
    return this.http.options(`${this.API_URL}/auth/login`);
  }

  logEnvironmentInfo(): void {
    console.log('🔧 Environment Configuration:');
    console.log('- Production:', environment.production);
    console.log('- API URL:', environment.apiUrl);
    console.log('- Swagger URL:', environment.swaggerUrl);
    console.log('- Current Origin:', window.location.origin);
    console.log('- Current Host:', window.location.host);
  }
}
