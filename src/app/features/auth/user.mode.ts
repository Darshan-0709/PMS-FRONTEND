type Role = 'student' | 'placement_cell' | 'recruiter';
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
  placementCellDegrees: Degree[]
}
export interface RegisterBaseData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

export interface StudentProfileData {
  enrollmentNumber: string;
  fullName: string;
  degreeId: string;
  placementCellId: string;
}

export interface PlacementCellProfileData {
  placementCellName: string;
  domains: string[];
  branchName: string;
  degreeNames: string[];
  placementCellEmail: string;
  website: string;
}

export interface RecruiterProfileData {
  companyName: string;
  representativePosition: string;
  description: string;
  website: string;
  companyEmail: string;
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
