import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankAccountDTO, AccountStatus } from '../models/account.model';
import {
  AccountHistoryDTO,
  CreditRequest,
  DebitRequest,
  TransferRequest,
} from '../models/operation.model';

export interface CreateCurrentAccountRequest {
  customerId: number;
  initialBalance: number;
  overDraft: number;
}

export interface CreateSavingAccountRequest {
  customerId: number;
  initialBalance: number;
  interestRate: number;
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly API_URL = '/api';

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<BankAccountDTO[]> {
    return this.http.get<BankAccountDTO[]>(`${this.API_URL}/accounts`);
  }

  getAccountById(accountId: string): Observable<BankAccountDTO> {
    return this.http.get<BankAccountDTO>(
      `${this.API_URL}/accounts/${accountId}`
    );
  }

  getCustomerAccounts(customerId: number): Observable<BankAccountDTO[]> {
    return this.http.get<BankAccountDTO[]>(
      `${this.API_URL}/customers/${customerId}/accounts`
    );
  }

  getAccountHistory(accountId: string): Observable<AccountHistoryDTO> {
    return this.http.get<AccountHistoryDTO>(
      `${this.API_URL}/accounts/${accountId}/operations`
    );
  }

  getAccountPageHistory(
    accountId: string,
    page: number,
    size: number
  ): Observable<AccountHistoryDTO> {
    return this.http.get<AccountHistoryDTO>(
      `${this.API_URL}/accounts/${accountId}/pageOperations?page=${page}&size=${size}`
    );
  }

  createCurrentAccount(
    request: CreateCurrentAccountRequest
  ): Observable<BankAccountDTO> {
    return this.http.post<BankAccountDTO>(
      `${this.API_URL}/accounts/current`,
      request
    );
  }

  createSavingAccount(
    request: CreateSavingAccountRequest
  ): Observable<BankAccountDTO> {
    return this.http.post<BankAccountDTO>(
      `${this.API_URL}/accounts/saving`,
      request
    );
  }

  debit(request: DebitRequest): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/accounts/debit`, request);
  }

  credit(request: CreditRequest): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/accounts/credit`, request);
  }

  transfer(request: TransferRequest): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/accounts/transfer`, request);
  }

  changeAccountStatus(
    accountId: string,
    status: AccountStatus
  ): Observable<BankAccountDTO> {
    return this.http.put<BankAccountDTO>(
      `${this.API_URL}/accounts/${accountId}/status?status=${status}`,
      {}
    );
  }
}
