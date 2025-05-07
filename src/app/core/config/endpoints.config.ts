export const API_ENDPOINTS = {
  students: {
    getProfile: (id: string) => `/students/${id}`,
    updateProfile: (id: string) => `/students/${id}`,
  },
  placementCells: {
    getProfile: (id: string) => `/placement_cells/${id}`,
    updateProfile: (id: string) => `/placement_cells/${id}`,
  },
  recruiters: {
    getProfile: (id: string) => `/recruiters/${id}`,
    updateProfile: (id: string) => `/recruiters/${id}`,
  },
} as const;
