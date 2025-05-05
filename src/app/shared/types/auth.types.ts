export type Role = 'student' | 'placement_cell' | 'recruiter';

export interface AuthUser {
  userId: string;
  email: string;
  role: Role;
  studentId?: string;
  placementCellId?: string;
  recruiterId?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
