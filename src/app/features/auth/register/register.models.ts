import { FormControl } from '@angular/forms';

type Role = 'student' | 'placement_cell' | 'recruiter';

export interface StudentProfileData {
  enrollmentNumber: string;
  fullName: string;
  degreeId: string;
  placementCellId: string;
  placementCellSearch: string;
}

export interface RecruiterProfileData {
  companyName: string;
  representativePosition: string;
  description: string;
  website: string;
  companyEmail: string;
}

export interface PlacementCellProfileData {
  name: string;
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


export type FinalRegistrationPayload =
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
export interface StudentProfileFormModel {
  enrollmentNumber: string;
  fullName: string;
  degreeId: string;
  branchId: string;
  placementCellId: string;
  placementCellSearch: string;
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
