export interface RecruiterProfile {
  companyName: string;
  representativePosition: string;
  description: string;
  website: string;
  companyEmail: string;
}

export interface RecruiterUpdatePayload {
  companyName?: string;
  representativePosition?: string;
  description?: string;
  website?: string;
  companyEmail?: string;
}

export interface RecruiterApiResponse {
  success: boolean;
  message: string;
  data: RecruiterProfile;
} 