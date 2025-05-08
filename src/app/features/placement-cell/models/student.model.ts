import { Pagination } from '../../../core/config/api.config';

export interface StudentDegree {
  degreeId: string;
  name: string;
}

export interface PlacementCellReference {
  placementCellId: string;
  placementCellName: string;
}

export interface Student {
  studentId: string;
  enrollmentNumber: string;
  fullName: string;
  cgpa: number | null;
  bachelorsGpa: number | null;
  tenthPercentage: number | null;
  twelfthPercentage: number | null;
  diplomaPercentage: number | null;
  backlogs: number | null;
  liveBacklogs: number | null;
  placementStatus: string;
  resumeUrl: string | null;
  isVerifiedByPlacementCell: boolean;
  degree: StudentDegree;
  placement_cell: PlacementCellReference;
}

export interface StudentsResponse {
  success: boolean;
  message: string;
  data: Student[];
  pagination?: Pagination;
}

export interface VerifyStudentsPayload {
  studentIds: string[];
  isVerifiedByPlacementCell: boolean;
}

export interface StudentUpdatePayload {
  fullName?: string;
  enrollmentNumber?: string;
  cgpa?: number | null;
  bachelorsGpa?: number | null;
  tenthPercentage?: number | null;
  twelfthPercentage?: number | null;
  diplomaPercentage?: number | null;
  backlogs?: number | null;
  liveBacklogs?: number | null;
  resumeUrl?: string | null;
  placementStatus?: string;
  isVerifiedByPlacementCell?: boolean;
  degreeId?: string;
}
