import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CustomersListComponent } from './features/customers/customers-list/customers-list.component';
import { CustomerFormComponent } from './features/customers/customer-form/customer-form.component';
import { CustomerAccountsComponent } from './features/accounts/customer-accounts/customer-accounts.component';
import { AccountsListComponent } from './features/accounts/accounts-list/accounts-list.component';
import { AccountOperationsComponent } from './features/operations/account-operations/account-operations.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: 'customers', component: CustomersListComponent },
  { path: 'customers/new', component: CustomerFormComponent },
  { path: 'customers/:id/edit', component: CustomerFormComponent },
  { path: 'customers/:id/accounts', component: CustomerAccountsComponent },
  { path: 'accounts', component: AccountsListComponent },
  { path: 'accounts/:id/operations', component: AccountOperationsComponent },
  { path: '**', component: NotFoundComponent },
];
