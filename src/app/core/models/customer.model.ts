export interface CustomerDTO {
  id: number;
  name: string;
  email: string;
}

export interface Customer extends CustomerDTO {}

export interface CreateCustomerRequest {
  name: string;
  email: string;
}

export interface UpdateCustomerRequest {
  name: string;
  email: string;
}
