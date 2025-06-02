import { Degree } from './common.types';

export type PlacementStatus = 'not_placed' | 'placed' | 'seeking';

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
  resumeUrl: string | null;
  placementStatus: PlacementStatus;
  isVerifiedByPlacementCell: boolean;
  degree: Degree;
  placement_cell: {
    placementCellId: string;
    placementCellName: string;
  };
}

export interface StudentUpdateRequest {
  fullName?: string;
  enrollmentNumber?: string;
  degreeId?: string;
  cgpa?: number;
  bachelorsGpa?: number;
  tenthPercentage?: number;
  twelfthPercentage?: number;
  diplomaPercentage?: number;
  backlogs?: number;
  liveBacklogs?: number;
  placementStatus?: PlacementStatus;
  isVerifiedByPlacementCell?: boolean;
}

export interface BatchVerifyStudentsRequest {
  studentIds: string[];
  isVerifiedByPlacementCell: boolean;
}

export interface PaginatedStudents {
  students: Student[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
