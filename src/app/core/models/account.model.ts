export type AccountStatus = 'CREATED' | 'ACTIVATED' | 'SUSPENDED' | 'CLOSED';
export type AccountType = 'CURRENT_ACCOUNT' | 'SAVING_ACCOUNT';

export interface CustomerDTO {
  id: number;
  name: string;
  email: string;
}

export interface BankAccountDTO {
  id: string;
  balance: number;
  createdAt: string;
  status: AccountStatus;
  customerDTO: CustomerDTO;
  type: AccountType;
}

export interface CurrentBankAccountDTO extends BankAccountDTO {
  type: 'CURRENT_ACCOUNT';
  overDraft: number;
}

export interface SavingBankAccountDTO extends BankAccountDTO {
  type: 'SAVING_ACCOUNT';
  interestRate: number;
}

// Legacy interfaces for backward compatibility
export interface Customer extends CustomerDTO {}
export interface BankAccount extends BankAccountDTO {}
export interface CurrentBankAccount extends CurrentBankAccountDTO {}
export interface SavingBankAccount extends SavingBankAccountDTO {}
