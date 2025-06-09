export type OperationType = 'CREDIT' | 'DEBIT';

export interface AccountOperationDTO {
  id: number;
  operationDate: string;
  amount: number;
  description?: string;
  type: OperationType;
}

export interface AccountHistoryDTO {
  accountId: string;
  balance: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  accountOperationDTOS: AccountOperationDTO[];
}

// Legacy interfaces for backward compatibility
export interface AccountOperation extends AccountOperationDTO {}
export interface AccountHistory extends AccountHistoryDTO {}

export interface DebitRequest {
  accountId: string;
  amount: number;
  description?: string;
}

export interface CreditRequest {
  accountId: string;
  amount: number;
  description?: string;
}

export interface TransferRequest {
  accountSource: string;
  accountDestination: string;
  amount: number;
  description?: string;
}
