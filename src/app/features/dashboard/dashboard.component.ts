import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  DashboardService,
  DashboardStats,
  RecentActivity,
  ChartData as DashboardChartData,
} from '../../core/services/dashboard.service';
import { NotificationService } from '../../core/services/notification.service';
import { BackendTestService } from '../../core/services/backend-test.service';
import { BankAccountDTO, AccountStatus } from '../../core/models/account.model';
import { CustomerDTO } from '../../core/models/customer.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LoadingSpinnerComponent,
    BaseChartDirective,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  loading = false;
  stats: DashboardStats = {
    totalCustomers: 0,
    totalAccounts: 0,
    activeAccounts: 0,
    totalBalance: 0,
    currentAccounts: 0,
    savingAccounts: 0,
    suspendedAccounts: 0,
    closedAccounts: 0,
    createdAccounts: 0,
    averageBalance: 0,
    activationRate: 0,
  };
  recentActivity: RecentActivity = {
    recentCustomers: [],
    recentAccounts: [],
    recentOperations: [],
  };
  chartData: DashboardChartData | null = null;

  // Chart configurations
  accountStatusChartData: ChartData<'doughnut'> = {
    labels: ['Active', 'Suspended', 'Created', 'Closed'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#28a745', '#ffc107', '#17a2b8', '#dc3545'],
        borderWidth: 0,
      },
    ],
  };

  accountTypeChartData: ChartData<'pie'> = {
    labels: ['Current Accounts', 'Saving Accounts'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#007bff', '#fd7e14'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  balanceRangeChartData: ChartData<'bar'> = {
    labels: ['$0-1K', '$1K-5K', '$5K-10K', '$10K-50K', '$50K+'],
    datasets: [
      {
        label: 'Number of Accounts',
        data: [0, 0, 0, 0, 0],
        backgroundColor: '#007bff',
        borderColor: '#0056b3',
        borderWidth: 1,
      },
    ],
  };

  monthlyTrendsChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'New Accounts',
        data: [],
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'New Customers',
        data: [],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  balanceTrendsChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Total Balance ($)',
        data: [],
        borderColor: '#fd7e14',
        backgroundColor: 'rgba(253, 126, 20, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Chart options
  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  balanceLineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  constructor(
    private dashboardService: DashboardService,
    private notificationService: NotificationService,
    private backendTestService: BackendTestService
  ) {}
  ngOnInit(): void {
    // Log environment info for debugging
    this.backendTestService.logEnvironmentInfo();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    console.log('Dashboard: Starting to load dashboard data...');
    this.loading = true;

    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        console.log('Dashboard: Successfully received dashboard data:', data);
        this.stats = data.stats;
        this.recentActivity = data.recentActivity;
        this.chartData = data.chartData;
        this.updateChartConfigurations();
        this.loading = false;
        console.log('Dashboard: Data loading completed successfully');
      },
      error: (error) => {
        console.error('Dashboard: Error loading dashboard data:', error);
        console.error('Dashboard: Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url,
        });

        let errorMessage = 'Failed to load dashboard data';
        if (error.status === 0) {
          errorMessage =
            'Cannot connect to backend server. Please ensure your Spring Boot backend is running on http://localhost:8080';
        } else if (error.status === 401) {
          errorMessage = 'Authentication required. Please login again.';
        } else if (error.status === 403) {
          errorMessage =
            'Access denied. You may not have permission to view this data.';
        } else if (error.status >= 500) {
          errorMessage = 'Server error. Please check your backend server.';
        }

        this.notificationService.showError('Error', errorMessage);
        this.loading = false;
      },
    });
  }

  private updateChartConfigurations(): void {
    if (!this.chartData) return;

    // Update Account Status Chart
    this.accountStatusChartData = {
      ...this.accountStatusChartData,
      datasets: [
        {
          data: this.chartData.accountStatusData.map((item) => item.value),
          backgroundColor: this.chartData.accountStatusData.map(
            (item) => item.color
          ),
          borderWidth: 0,
        },
      ],
    };

    // Update Account Type Chart
    this.accountTypeChartData = {
      ...this.accountTypeChartData,
      datasets: [
        {
          data: this.chartData.accountTypeData.map((item) => item.value),
          backgroundColor: this.chartData.accountTypeData.map(
            (item) => item.color
          ),
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    };

    // Update Balance Range Chart
    this.balanceRangeChartData = {
      ...this.balanceRangeChartData,
      datasets: [
        {
          label: 'Number of Accounts',
          data: this.chartData.balanceRangeData.map((item) => item.count),
          backgroundColor: '#007bff',
          borderColor: '#0056b3',
          borderWidth: 1,
        },
      ],
    };

    // Update Monthly Trends Charts
    this.monthlyTrendsChartData = {
      labels: this.chartData.monthlyTrends.labels,
      datasets: [
        {
          label: 'New Accounts',
          data: this.chartData.monthlyTrends.accountsData,
          borderColor: '#28a745',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'New Customers',
          data: this.chartData.monthlyTrends.customersData,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };

    this.balanceTrendsChartData = {
      labels: this.chartData.monthlyTrends.labels,
      datasets: [
        {
          label: 'Total Balance ($)',
          data: this.chartData.monthlyTrends.balanceData,
          borderColor: '#fd7e14',
          backgroundColor: 'rgba(253, 126, 20, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }

  getStatusBadgeClass(status: AccountStatus): string {
    switch (status) {
      case 'CREATED':
        return 'bg-info';
      case 'ACTIVATED':
        return 'bg-success';
      case 'SUSPENDED':
        return 'bg-warning';
      case 'CLOSED':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getAccountTypeIcon(type: string): string {
    return type === 'CURRENT_ACCOUNT' ? 'bi-credit-card' : 'bi-piggy-bank';
  }

  getAccountTypeName(type: string): string {
    return type === 'CURRENT_ACCOUNT' ? 'Current' : 'Saving';
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  testBackendConnection(): void {
    console.log('🔍 Testing backend connection...');
    this.backendTestService.testBackendConnectivity().subscribe({
      next: (response) => {
        console.log('✅ Backend connection successful:', response);
        this.notificationService.showSuccess(
          'Success',
          'Backend connection is working!'
        );
      },
      error: (error) => {
        console.error('❌ Backend connection failed:', error);
        let errorMessage = 'Backend connection failed';
        if (error.status === 0) {
          errorMessage =
            'Cannot reach backend server. Please check if Spring Boot is running on http://localhost:8080';
        } else if (error.status === 401) {
          errorMessage = 'Authentication required. Please login first.';
        } else if (error.status === 403) {
          errorMessage = 'Access denied. Check your permissions.';
        }
        this.notificationService.showError('Connection Failed', errorMessage);
      },
    });
  }
}
