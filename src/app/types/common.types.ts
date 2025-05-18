export interface Degree {
  degreeId: string;
  name: string;
}

export interface Branch {
  branchId: string;
  name: string;
}

export interface Domain {
  domainId: string;
  name: string;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export interface PlacementCellListItem {
  placementCellId: string;
  placementCellName: string;
  branch: Branch;
  domain: string[];
  placementCellDomains: string[];
  placementCellDegrees: Degree[];
}

// Route related types
export interface Route {
  path: string;
  title: string;
  icon?: string;
}

export const STUDENT_ROUTES: Route[] = [
  { path: '/student/dashboard', title: 'Dashboard', icon: 'dashboard' },
  { path: '/student/profile', title: 'Profile', icon: 'person' },
];

export const PLACEMENT_CELL_ROUTES: Route[] = [
  { path: '/placement-cell/dashboard', title: 'Dashboard', icon: 'dashboard' },
  { path: '/placement-cell/students', title: 'Students', icon: 'school' },
  { path: '/placement-cell/profile', title: 'Profile', icon: 'business' },
];

export const RECRUITER_ROUTES: Route[] = [
  { path: '/recruiter/dashboard', title: 'Dashboard', icon: 'dashboard' },
  { path: '/recruiter/jobs', title: 'Jobs', icon: 'work' },
  { path: '/recruiter/profile', title: 'Profile', icon: 'business' },
];
