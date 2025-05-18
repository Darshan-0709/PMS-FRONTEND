export interface Recruiter {
  recruiterId: string;
  companyName: string;
  representativePosition: string;
  description: string;
  website: string;
  companyEmail: string;
  representativeId: string;
}

export interface RecruiterUpdateRequest {
  companyName?: string;
  companyEmail?: string;
  representativePosition?: string;
  description?: string;
  website?: string;
}
