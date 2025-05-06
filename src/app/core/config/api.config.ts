export const API_CONFIG = {
  baseUrl: 'http://localhost:3000/api/v1',
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      validateUser: '/auth/validate-user',
    },
    placementCell: {
      list: '/placement_cells_list',
    },
    degrees: '/degrees',
    branches: '/branches',
  },
} as const;

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ApiError;
  pagination?: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type ApiError  = Record<string, string>