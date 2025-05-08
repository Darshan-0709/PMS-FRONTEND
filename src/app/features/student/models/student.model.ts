import { Degree } from '../../../shared/types/common.types';
import { ApiResponse } from '../../../models/api-response.model';

// Student profile data model
export interface StudentProfile {
  studentId: string;
  fullName: string;
  enrollmentNumber: string;
  cgpa: number | null;
  bachelorsGpa: number | null;
  tenthPercentage: number | null;
  twelfthPercentage: number | null;
  diplomaPercentage: number | null;
  backlogs: number | null;
  liveBacklogs: number | null;
  resumeUrl: string | null;
  placementStatus: string;
  isVerifiedByPlacementCell: boolean;
  degree: {
    degreeId: string;
    name: string;
  };
  placement_cell: {
    placementCellId: string;
    placementCellName: string;
  };
}

// Student API response type
export interface StudentApiResponse extends ApiResponse<StudentProfile> {}

// Basic update payload for student (used by student themselves)
export interface StudentProfileUpdatePayload {
  fullName?: string;
  cgpa?: number | null;
  bachelorsGpa?: number | null;
  tenthPercentage?: number | null;
  twelfthPercentage?: number | null;
  diplomaPercentage?: number | null;
  backlogs?: number | null;
  liveBacklogs?: number | null;
}

// Extended update payload for placement cell
export interface StudentProfilePlacementCellUpdatePayload
  extends StudentProfileUpdatePayload {
  enrollmentNumber?: string;
  placementStatus?: string;
  isVerifiedByPlacementCell?: boolean;
  degreeId?: string;
}
