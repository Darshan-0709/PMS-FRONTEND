// API Response Types
export interface Branch {
  branchId: string;
  name: string;
}

export interface Degree {
  degreeId: string;
  name: string;
}

export interface PlacementCellApiData {
  placementCellId: string;
  placementCellName: string;
  branch: Branch;
  domain: string[];
  placementCellDomains: string[];
  placementCellDegrees: Degree[];
}

// Role Type
type Role = 'student' | 'placement_cell' | 'recruiter';

// API Data Types
export interface StudentProfileData {
  enrollmentNumber: string;
  fullName: string;
  degreeId: string;
  placementCellId: string;
}

export interface RecruiterProfileData {
  companyName: string;
  representativePosition: string;
  description: string;
  website: string;
  companyEmail: string;
}

export interface PlacementCellProfileData {
  placementCellName: string;
  domains: string[];
  branchName: string;
  degreeNames: string[];
  placementCellEmail: string;
  website: string;
}

export interface RegisterBaseData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

export type RegisterInput =
  | (RegisterBaseData & {
      role: 'student';
      studentProfileData: StudentProfileData;
    })
  | (RegisterBaseData & {
      role: 'placement_cell';
      placementCellProfileData: PlacementCellProfileData;
    })
  | (RegisterBaseData & {
      role: 'recruiter';
      recruiterProfileData: RecruiterProfileData;
    });

// Form Types
export interface StudentProfileFormModel {
  enrollmentNumber: string;
  fullName: string;
  degreeId: string;
  placementCellId: string;
}

export interface RecruiterProfileFormModel {
  companyName: string;
  representativePosition: string;
  description: string;
  website: string;
  companyEmail: string;
}

export interface PlacementCellProfileFormModel {
  name: string;
  domains: string[];
  enteredDomain: string;
  branchName: string;
  degreeNames: string[];
  placementCellEmail: string;
  website: string;
}

export interface UserFormModel {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}
