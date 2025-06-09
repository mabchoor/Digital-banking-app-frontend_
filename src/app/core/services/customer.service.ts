import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Customer,
  CustomerDTO,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from '../models/customer.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<CustomerDTO[]> {
    return this.http.get<CustomerDTO[]>(`${this.API_URL}/customers`);
  }

  getCustomerById(id: number): Observable<CustomerDTO> {
    return this.http.get<CustomerDTO>(`${this.API_URL}/customers/${id}`);
  }

  searchCustomers(keyword: string): Observable<CustomerDTO[]> {
    return this.http.get<CustomerDTO[]>(
      `${this.API_URL}/customers/search?keyword=${keyword}`
    );
  }

  createCustomer(customer: CreateCustomerRequest): Observable<CustomerDTO> {
    return this.http.post<CustomerDTO>(`${this.API_URL}/customers`, customer);
  }

  updateCustomer(
    id: number,
    customer: UpdateCustomerRequest
  ): Observable<CustomerDTO> {
    return this.http.put<CustomerDTO>(
      `${this.API_URL}/customers/${id}`,
      customer
    );
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/customers/${id}`);
  }
}
