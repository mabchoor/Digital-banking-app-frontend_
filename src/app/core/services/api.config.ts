import { environment } from '../../../environments/environment';

export const API_BASE_URL = environment.apiUrl;
export const SWAGGER_URL = environment.swaggerUrl;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  CUSTOMERS: {
    LIST: `${API_BASE_URL}/customers`,
    CREATE: `${API_BASE_URL}/customers`,
    UPDATE: `${API_BASE_URL}/customers/:id`,
    DELETE: `${API_BASE_URL}/customers/:id`,
  },
  ACCOUNTS: {
    LIST: `${API_BASE_URL}/accounts`,
    CREATE: `${API_BASE_URL}/accounts`,
    OPERATIONS: `${API_BASE_URL}/accounts/:id/operations`,
  },
};
