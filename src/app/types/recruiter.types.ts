export interface Recruiter {
  recruiterId: string;
  companyName: string;
  representativePosition: string;
  description: string;
  website: string;
  companyEmail: string;
  representativeId: string;
}

export type RecruiterUpdatePayload = Pick<
  Recruiter,
  'companyName' | 'representativePosition' | 'description' | 'website' | 'companyEmail'
>;

export interface RecruiterApiResponse {
  success: boolean;
  message: string;
  data: Recruiter;
}
