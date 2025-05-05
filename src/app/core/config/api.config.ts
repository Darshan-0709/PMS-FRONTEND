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

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};
