type Role = 'student' | 'placement_cell' | 'recruiter';

export interface RegisterBaseData {
    email: string;
    username: string;
    password: string;
    confirmPassword: string, 
    role: Role;
}

export interface StudentProfileData {
    enrollmentNumber: string;
    fullName: string;
    degreeId: string;
    placementCellId: string;
}

export interface PlacementCellProfileData {
    name: string;
    domains: string[];
    branchName: string;
    degreeNames: string[];
    email: string;
    website: string;
}

export interface RecruiterProfileData {
    companyName: string;
    representativePosition: string;
    description: string;
    website: string;
    email: string;
}


export type RegisterInput =
    | (RegisterBaseData & {
          role: "student";
          studentProfileData: StudentProfileData;
      })
    | (RegisterBaseData & {
          role: "placement_cell";
          placementCellProfileData: PlacementCellProfileData;
      })
    | (RegisterBaseData & {
          role: "recruiter";
          recruiterProfileData: RecruiterProfileData;
      });

