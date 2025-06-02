/**
 * Navigation configuration for the application
 */

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

export const NAVIGATION_CONFIG: Record<string, NavItem[]> = {
  // Student navigation items
  student: [
    { label: 'Dashboard', path: '/student/dashboard', icon: 'dashboard' },
    { label: 'Profile', path: '/student/profile', icon: 'account_circle' },
    { label: 'Job Opportunities', path: '/student/jobs', icon: 'work' },
    {
      label: 'My Applications',
      path: '/student/applications',
      icon: 'description',
    },
    {
      label: 'Selection Process',
      path: '/student/selection',
      icon: 'assignment_turned_in',
    },
    {
      label: 'Results & Offers',
      path: '/student/results',
      icon: 'military_tech',
    },
  ],

  // Placement cell navigation items
  placement_cell: [
    {
      label: 'Dashboard',
      path: '/placement-cell/dashboard',
      icon: 'dashboard',
    },
    {
      label: 'Profile',
      path: '/placement-cell/profile',
      icon: 'account_circle',
    },
    {
      label: 'Student Management',
      path: '/placement-cell/students',
      icon: 'people',
    },
    {
      label: 'Job Requests',
      path: '/placement-cell/job-requests',
      icon: 'inbox',
    },
    {
      label: 'Drive Management',
      path: '/placement-cell/drives',
      icon: 'event',
    },
    {
      label: 'Selection Rounds',
      path: '/placement-cell/rounds',
      icon: 'rule',
    },
    {
      label: 'Applications',
      path: '/placement-cell/applications',
      icon: 'description',
    },
    {
      label: 'Results',
      path: '/placement-cell/results',
      icon: 'analytics',
    },
  ],

  // Recruiter navigation items
  recruiter: [
    { label: 'Dashboard', path: '/recruiter/dashboard', icon: 'dashboard' },
    { label: 'Profile', path: '/recruiter/profile', icon: 'account_circle' },
    { label: 'Job Postings', path: '/recruiter/jobs', icon: 'work' },
    {
      label: 'Eligibility Criteria',
      path: '/recruiter/criteria',
      icon: 'rule',
    },
    {
      label: 'Target Colleges',
      path: '/recruiter/target-colleges',
      icon: 'school',
    },
    {
      label: 'Drive Schedule',
      path: '/recruiter/drives',
      icon: 'event',
    },
    {
      label: 'Selection Process',
      path: '/recruiter/selection',
      icon: 'rule_folder',
    },
    {
      label: 'Applications',
      path: '/recruiter/applications',
      icon: 'description',
    },
    {
      label: 'Results & Offers',
      path: '/recruiter/results',
      icon: 'assignment_turned_in',
    },
  ],
};
