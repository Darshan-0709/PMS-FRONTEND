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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface BaseRegisterRequest {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface StudentProfileData {
  enrollmentNumber: string;
  fullName: string;
  degreeId: string;
  placementCellId: string;
}

export interface PlacementCellProfileData {
  placementCellName: string;
  placementCellEmail: string;
  website: string;
  branchId: string;
  domains: string[];
  degrees: string[];
}

export interface RecruiterProfileData {
  companyName: string;
  representativePosition: string;
  description: string;
  website: string;
  companyEmail: string;
}

export interface StudentRegisterRequest extends BaseRegisterRequest {
  role: 'student';
  studentProfileData: StudentProfileData;
}

export interface PlacementCellRegisterRequest extends BaseRegisterRequest {
  role: 'placement_cell';
  placementCellProfileData: PlacementCellProfileData;
}

export interface RecruiterRegisterRequest extends BaseRegisterRequest {
  role: 'recruiter';
  recruiterProfileData: RecruiterProfileData;
}

export type RegisterRequest =
  | StudentRegisterRequest
  | PlacementCellRegisterRequest
  | RecruiterRegisterRequest;

// Form related types for registration
// export interface BaseRegisterRequest {
//   //BaseRegisterRequest
//   email: string;
//   username: string;
//   password: string;
//   confirmPassword: string;
// }

// export interface StudentProfileData {
//   //StudentProfileData
//   enrollmentNumber: string;
//   fullName: string;
//   degreeId: string;
//   placementCellId: string;
// }

// export interface RecruiterProfileData {
//   //RecruiterProfileData
//   companyName: string;
//   representativePosition: string;
//   description: string;
//   website: string;
//   companyEmail: string;
// }

// export interface PlacementCellProfileData {
//   //PlacementCellProfileData
//   name: string;
//   domains: string[];
//   enteredDomain: string;
//   branchName: string;
//   degreeNames: string[];
//   placementCellEmail: string;
//   website: string;
// }

// Helper type for transforming form models to API request data
export interface RegisterFormData {
  userForm: BaseRegisterRequest;
  studentProfile?: StudentProfileData;
  recruiterProfile?: RecruiterProfileData;
  placementCellProfile?: PlacementCellProfileData;
}
