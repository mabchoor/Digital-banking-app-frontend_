import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, throwError } from 'rxjs';
import {
  BankAccountDTO,
  AccountStatus,
  AccountType,
} from '../models/account.model';
import { CustomerDTO } from '../models/customer.model';
import { AccountOperationDTO } from '../models/operation.model';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalCustomers: number;
  totalAccounts: number;
  activeAccounts: number;
  totalBalance: number;
  currentAccounts: number;
  savingAccounts: number;
  suspendedAccounts: number;
  closedAccounts: number;
  createdAccounts: number;
  averageBalance: number;
  activationRate: number;
}

export interface RecentActivity {
  recentCustomers: CustomerDTO[];
  recentAccounts: BankAccountDTO[];
  recentOperations: AccountOperationDTO[];
}

export interface ChartData {
  accountStatusData: { label: string; value: number; color: string }[];
  accountTypeData: { label: string; value: number; color: string }[];
  balanceRangeData: { range: string; count: number }[];
  monthlyTrends: {
    labels: string[];
    accountsData: number[];
    customersData: number[];
    balanceData: number[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<{
    stats: DashboardStats;
    recentActivity: RecentActivity;
    chartData: ChartData;
  }> {
    console.log('DashboardService: Loading dashboard data from backend...');
    console.log('DashboardService: API URLs:', {
      customers: `${this.API_URL}/customers`,
      accounts: `${this.API_URL}/accounts`,
      baseUrl: this.API_URL,
    });

    // Test backend connectivity first
    console.log('DashboardService: Testing backend connectivity...');

    return forkJoin({
      customers: this.http.get<CustomerDTO[]>(`${this.API_URL}/customers`).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('DashboardService: Error fetching customers:', error);
          return throwError(() => error);
        })
      ),
      accounts: this.http
        .get<BankAccountDTO[]>(`${this.API_URL}/accounts`)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            console.error('DashboardService: Error fetching accounts:', error);
            return throwError(() => error);
          })
        ),
    }).pipe(
      map(({ customers, accounts }) => {
        console.log(
          'DashboardService: Successfully received data from backend:',
          {
            customersCount: customers.length,
            accountsCount: accounts.length,
            customers: customers.slice(0, 3), // Show first 3 for debugging
            accounts: accounts.slice(0, 3), // Show first 3 for debugging
          }
        );

        const stats = this.calculateStats(customers, accounts);
        const recentActivity = this.getRecentActivity(customers, accounts);
        const chartData = this.prepareChartData(customers, accounts);

        console.log('DashboardService: Calculated stats:', stats);
        return { stats, recentActivity, chartData };
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(
          'DashboardService: Failed to load dashboard data:',
          error
        );
        console.error('DashboardService: Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
        });
        return throwError(() => error);
      })
    );
  }

  private calculateStats(
    customers: CustomerDTO[],
    accounts: BankAccountDTO[]
  ): DashboardStats {
    const totalCustomers = customers.length;
    const totalAccounts = accounts.length;
    const activeAccounts = accounts.filter(
      (acc) => acc.status === 'ACTIVATED'
    ).length;
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const currentAccounts = accounts.filter(
      (acc) => acc.type === 'CURRENT_ACCOUNT'
    ).length;
    const savingAccounts = accounts.filter(
      (acc) => acc.type === 'SAVING_ACCOUNT'
    ).length;
    const suspendedAccounts = accounts.filter(
      (acc) => acc.status === 'SUSPENDED'
    ).length;
    const closedAccounts = accounts.filter(
      (acc) => acc.status === 'CLOSED'
    ).length;
    const createdAccounts = accounts.filter(
      (acc) => acc.status === 'CREATED'
    ).length;
    const averageBalance = totalAccounts > 0 ? totalBalance / totalAccounts : 0;
    const activationRate =
      totalAccounts > 0 ? (activeAccounts / totalAccounts) * 100 : 0;

    return {
      totalCustomers,
      totalAccounts,
      activeAccounts,
      totalBalance,
      currentAccounts,
      savingAccounts,
      suspendedAccounts,
      closedAccounts,
      createdAccounts,
      averageBalance,
      activationRate,
    };
  }

  private getRecentActivity(
    customers: CustomerDTO[],
    accounts: BankAccountDTO[]
  ): RecentActivity {
    // Sort customers by ID (assuming higher ID means more recent)
    const recentCustomers = customers.sort((a, b) => b.id - a.id).slice(0, 5);

    // Sort accounts by creation date (most recent first)
    const recentAccounts = accounts
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    return {
      recentCustomers,
      recentAccounts,
      recentOperations: [], // This would need a separate API call to get recent operations
    };
  }

  private prepareChartData(
    customers: CustomerDTO[],
    accounts: BankAccountDTO[]
  ): ChartData {
    // Account Status Data
    const accountStatusData = [
      {
        label: 'Active',
        value: accounts.filter((acc) => acc.status === 'ACTIVATED').length,
        color: '#28a745',
      },
      {
        label: 'Suspended',
        value: accounts.filter((acc) => acc.status === 'SUSPENDED').length,
        color: '#ffc107',
      },
      {
        label: 'Created',
        value: accounts.filter((acc) => acc.status === 'CREATED').length,
        color: '#17a2b8',
      },
      {
        label: 'Closed',
        value: accounts.filter((acc) => acc.status === 'CLOSED').length,
        color: '#dc3545',
      },
    ];

    // Account Type Data
    const accountTypeData = [
      {
        label: 'Current Accounts',
        value: accounts.filter((acc) => acc.type === 'CURRENT_ACCOUNT').length,
        color: '#007bff',
      },
      {
        label: 'Saving Accounts',
        value: accounts.filter((acc) => acc.type === 'SAVING_ACCOUNT').length,
        color: '#fd7e14',
      },
    ];

    // Balance Range Data
    const ranges = [
      { min: 0, max: 1000, range: '$0-1K' },
      { min: 1000, max: 5000, range: '$1K-5K' },
      { min: 5000, max: 10000, range: '$5K-10K' },
      { min: 10000, max: 50000, range: '$10K-50K' },
      { min: 50000, max: Infinity, range: '$50K+' },
    ];

    const balanceRangeData = ranges.map((range) => ({
      range: range.range,
      count: accounts.filter(
        (acc) => acc.balance >= range.min && acc.balance < range.max
      ).length,
    }));

    // Monthly Trends (simulated data - would need actual historical data from backend)
    const monthlyTrends = this.generateMonthlyTrends(customers, accounts);

    return {
      accountStatusData,
      accountTypeData,
      balanceRangeData,
      monthlyTrends,
    };
  }

  private generateMonthlyTrends(
    customers: CustomerDTO[],
    accounts: BankAccountDTO[]
  ) {
    const months: string[] = [];
    const accountsData: number[] = [];
    const customersData: number[] = [];
    const balanceData: number[] = [];

    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });

      // Simulate monthly data based on existing data
      const accountsForMonth = Math.floor(
        (accounts.length * (0.8 + Math.random() * 0.4)) / 6
      );
      const customersForMonth = Math.floor(
        (customers.length * (0.8 + Math.random() * 0.4)) / 6
      );
      const balanceForMonth =
        (accounts.reduce((sum, acc) => sum + acc.balance, 0) *
          (0.7 + Math.random() * 0.6)) /
        6;

      months.push(monthStr);
      accountsData.push(accountsForMonth);
      customersData.push(customersForMonth);
      balanceData.push(balanceForMonth);
    }

    return {
      labels: months,
      accountsData,
      customersData,
      balanceData,
    };
  }

  // Get recent operations for a specific account
  getRecentOperations(
    accountId: string,
    limit: number = 5
  ): Observable<AccountOperationDTO[]> {
    return this.http
      .get<{ accountOperationDTOS: AccountOperationDTO[] }>(
        `${this.API_URL}/accounts/${accountId}/pageOperations?page=0&size=${limit}`
      )
      .pipe(map((response) => response.accountOperationDTOS));
  }

  // Get system-wide recent operations (would need backend support)
  getSystemRecentOperations(): Observable<AccountOperationDTO[]> {
    // This would need a dedicated endpoint in the backend
    // For now, return empty array
    return new Observable((observer) => {
      observer.next([]);
      observer.complete();
    });
  }
}
