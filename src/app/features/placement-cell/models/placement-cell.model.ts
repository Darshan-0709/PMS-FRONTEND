export interface Branch {
  branchId: string;
  name: string;
}

export interface DegreeItem {
  degree: {
    degreeId: string;
    name: string;
  };
}

export interface DomainItem {
  domain: string;
}

export interface PlacementCellProfile {
  placementCellId: string;
  placementCellName: string;
  branch: Branch;
  placementCellEmail: string;
  website: string;
  placementCellDegrees: DegreeItem[];
  placementCellDomains: DomainItem[];
}

export interface PlacementCellUpdatePayload {
  placementCellName?: string;
  placementCellEmail?: string;
  website?: string;
  domains?: string[];
  degrees?: string[];
}

export interface PlacementCellApiResponse {
  success: boolean;
  message: string;
  data: PlacementCellProfile;
}
