// API1 Interfaces
export interface Api1Response {
  metadata: {
    requestId: string;
    timestamp: string;
  };
  jobs: Api1JobOffer[];
}

export interface Api1JobOffer {
  jobId: string;
  title: string;
  details: {
    location: string;
    type: string;
    salaryRange: string;
  };
  company: {
    name: string;
    industry: string;
  };
  skills: string[];
  postedDate: string;
}

// Updated API2 Interfaces
export interface Api2Response {
  status: string;
  data: {
    jobsList: {
      [key: string]: Api2JobOffer;
    };
  };
}

export interface Api2JobOffer {
  position: string;
  location: {
    city: string;
    state: string;
    remote: boolean;
  };
  compensation: {
    min: number;
    max: number;
    currency: string;
  };
  employer: {
    companyName: string;
    website: string;
  };
  requirements: {
    experience: number;
    technologies: string[];
  };
  datePosted: string;
} 