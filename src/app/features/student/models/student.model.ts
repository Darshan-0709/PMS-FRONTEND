export interface Degree {
  degreeId: string;
  name: string;
}

export interface PlacementCell {
  placementCellId: string;
  placementCellName: string;
}

export interface StudentProfile {
  studentId: string;
  enrollmentNumber: string;
  fullName: string;
  cgpa: string;
  bachelorsGpa: string;
  tenthPercentage: string;
  twelfthPercentage: string;
  diplomaPercentage: string;
  backlogs: number;
  liveBacklogs: number;
  placementStatus: 'not_placed' | 'placed' | 'offered';
  resumeUrl: string | null;
  isVerifiedByPlacementCell: boolean;
  degree: Degree;
  placement_cell: PlacementCell;
}

export interface StudentProfileUpdatePayload {
  fullName?: string;
  cgpa?: string;
  bachelorsGpa?: string;
  tenthPercentage?: string;
  twelfthPercentage?: string;
  diplomaPercentage?: string;
  backlogs?: number;
  liveBacklogs?: number;
  resumeUrl?: string | null;
}

export interface StudentProfilePlacementCellUpdatePayload extends StudentProfileUpdatePayload {
  enrollmentNumber?: string;
  placementStatus?: 'not_placed' | 'placed' | 'offered';
  isVerifiedByPlacementCell?: boolean;
}

export interface StudentApiResponse {
  success: boolean;
  message: string;
  data: StudentProfile;
} 