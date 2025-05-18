import { Branch, Degree } from './common.types';

export interface PlacementCell {
  branch: Branch;
  placementCellName: string;
  placementCellEmail: string;
  website: string;
  placementCellDegrees: {
    degree: Degree;
  }[];
  placementCellDomains: {
    domain: string;
  }[];
}

export interface PlacementCellUpdateRequest {
  placementCellName?: string;
  placementCellEmail?: string;
  website?: string;
  branchId?: string;
  domains?: string[];
  degrees?: string[];
}
