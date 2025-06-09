# Digital Banking Frontend Application

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technical Stack](#technical-stack)
3. [Project Structure](#project-structure)
4. [Core Features](#core-features)
5. [Authentication System](#authentication-system)
6. [Customer Management](#customer-management)
7. [Account Management](#account-management)
8. [Operations Management](#operations-management)
9. [Dashboard & Analytics](#dashboard--analytics)
10. [Shared Components](#shared-components)
11. [Security Features](#security-features)

## Project Overview

The Digital Banking Frontend is a modern, responsive web application built with Angular that provides a comprehensive banking solution. The application offers a user-friendly interface for managing bank accounts, customers, and financial operations.

## Technical Stack

- **Framework**: Angular (Latest Version)
- **Styling**: Tailwind CSS
- **State Management**: Angular Services
- **HTTP Client**: Angular HttpClient
- **Authentication**: JWT-based authentication
- **UI Components**: Custom components with Tailwind CSS

## Project Structure

```
src/app/
├── core/           # Core services, models, and interfaces
├── features/       # Feature modules and components
├── pages/         # Main page components
├── shared/        # Shared components and utilities
└── app.module.ts  # Main application module
```

## Core Features

### Authentication System

- **User Registration**

  - Username and password registration
  - Form validation
  - Success/error notifications

- **User Login**
  - Secure authentication
  - JWT token management
  - Session persistence
  - Automatic token refresh

### Customer Management

- **Customer Operations**

  - Create new customers
  - View customer list
  - Update customer information
  - Delete customers
  - Search functionality
  - Pagination support

- **Customer Data Model**
  ```typescript
  interface Customer {
    id: number;
    name: string;
    email: string;
  }
  ```

### Account Management

- **Account Types**

  - Current Accounts
  - Savings Accounts
  - Account status tracking (Active, Suspended, Closed)

- **Account Features**
  - Account creation
  - Balance management
  - Interest rate configuration
  - Overdraft facility
  - Account status management

### Operations Management

- **Transaction Types**

  - Debit operations
  - Credit operations
  - Transfer operations

- **Operation Features**
  - Real-time balance updates
  - Transaction history
  - Operation validation
  - Amount verification
  - Description support

### Dashboard & Analytics

- **Key Metrics**
  - Total customers count
  - Total accounts
  - Active accounts
  - Total balance
  - Account type distribution
  - Average balance
  - Activation rate

### Shared Components

- **Loading Spinner**

  - Visual feedback during operations
  - Consistent loading states

- **Confirmation Modal**

  - Action confirmation dialogs
  - Customizable messages
  - Yes/No actions

- **Pagination**
  - Page navigation
  - Items per page selection
  - Total items display

### Security Features

- **Authentication**

  - JWT token-based authentication
  - Secure token storage
  - Automatic token refresh
  - Protected routes

- **Data Protection**
  - Form validation
  - Input sanitization
  - Error handling
  - Secure HTTP requests

## Code Examples

### Authentication Service

```typescript
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly API_URL = "http://localhost:8080/api";
  private readonly TOKEN_KEY = "auth_token";
  private readonly USER_KEY = "user_data";

  constructor(private http: HttpClient) {}

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, loginData).pipe(tap((response) => this.handleAuthResponse(response)));
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
```

### Customer Management Component

```typescript
@Component({
  selector: "app-customers-list",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingSpinnerComponent, ConfirmationModalComponent, PaginationComponent],
  templateUrl: "./customers-list.component.html",
})
export class CustomersListComponent implements OnInit {
  customers: Customer[] = [];
  loading = false;
  searchKeyword = "";

  // Pagination properties
  currentPage = 0;
  totalPages = 0;
  pageSize = 10;
}
```

### Account Operations Component

```typescript
@Component({
  selector: "app-account-operations",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoadingSpinnerComponent, PaginationComponent],
})
export class AccountOperationsComponent implements OnInit {
  accountId: string = "";
  account: BankAccount | null = null;
  accountHistory: AccountHistory | null = null;
  operations: AccountOperation[] = [];

  operationForm: FormGroup;
  loading: boolean = false;
}
```

## Application Screenshots

### Authentication Pages

#### Login Page

[Add screenshot of login page here]

- Clean and modern login interface
- Username and password fields
- Remember me option
- Forgot password link

#### Registration Page

[Add screenshot of registration page here]

- User registration form
- Password strength indicator
- Terms and conditions checkbox
- Validation feedback

### Dashboard

#### Main Dashboard

[Add screenshot of main dashboard here]

- Overview of key metrics
- Recent transactions
- Account balances
- Quick action buttons

#### Analytics Dashboard

[Add screenshot of analytics dashboard here]

- Charts and graphs
- Performance metrics
- Account distribution
- Transaction trends

### Customer Management

#### Customer List

[Add screenshot of customer list here]

- Searchable customer table
- Pagination controls
- Action buttons
- Status indicators

#### Customer Details

[Add screenshot of customer details here]

- Customer information
- Account summary
- Transaction history
- Edit options

### Account Operations

#### Account Overview

[Add screenshot of account overview here]

- Account details
- Balance information
- Transaction history
- Operation buttons

#### Transaction Form

[Add screenshot of transaction form here]

- Operation type selection
- Amount input
- Description field
- Confirmation dialog

### Shared Components

#### Loading Spinner

[Add screenshot of loading spinner here]

- Animated loading indicator
- Different states (loading, success, error)

#### Confirmation Modal

[Add screenshot of confirmation modal here]

- Action confirmation
- Customizable messages
- Yes/No buttons

#### Pagination

[Add screenshot of pagination component here]

- Page navigation
- Items per page selector
- Total items display

## Component Structure

```
src/app/
├── core/
│   ├── models/
│   │   ├── account.model.ts
│   │   ├── customer.model.ts
│   │   └── operation.model.ts
│   └── services/
│       ├── auth.service.ts
│       ├── customer.service.ts
│       └── account.service.ts
├── features/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── customers/
│   │   ├── customers-list/
│   │   └── customer-form/
│   └── operations/
│       └── account-operations/
└── shared/
    ├── components/
    │   ├── loading-spinner/
    │   ├── confirmation-modal/
    │   └── pagination/
    └── directives/
```

## API Integration

```typescript
// Example API endpoints
const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
  },
  CUSTOMERS: {
    LIST: "/api/customers",
    CREATE: "/api/customers",
    UPDATE: "/api/customers/:id",
    DELETE: "/api/customers/:id",
  },
  ACCOUNTS: {
    LIST: "/api/accounts",
    CREATE: "/api/accounts",
    OPERATIONS: "/api/accounts/:id/operations",
  },
};
```

## Styling Examples

```scss
// Example Tailwind CSS classes
.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.card {
  @apply bg-white rounded-lg shadow-md p-6;
}

.button {
  @apply px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700;
}

.form-input {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm;
}
```

## Error Handling

```typescript
// Example error handling service
@Injectable({
  providedIn: "root",
})
export class ErrorHandlingService {
  handleError(error: any): void {
    if (error.status === 401) {
      // Handle unauthorized access
      this.router.navigate(["/login"]);
    } else if (error.status === 403) {
      // Handle forbidden access
      this.notificationService.showError("Access Denied");
    } else {
      // Handle other errors
      this.notificationService.showError("An error occurred");
    }
  }
}
```
