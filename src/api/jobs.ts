import apiClient, { ApiResponse, PaginationParams, PaginatedResponse } from './apiClient';

// Types - Updated to match backend model
export interface Job {
  _id: string;
  id?: string; // Alias for _id
  title: string;
  company: string;
  location?: string;
  type: 'full-time' | 'internship'; // Backend enum values
  isOpen: boolean;
  draft?: boolean;
  description?: string;
  skillsRequired: string[]; // Backend uses skillsRequired not skills
  salary?: string;
  experienceLevel?: string;
  deadline?: string;
  requirements?: string[];
  postedBy: string | {
    _id: string;
    name?: string;
  };
  createdAt: string;
}

export interface JobApplication {
  id: string;
  job: Job;
  applicant: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  resumeUrl: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  appliedAt: string;
}

export interface CreateJobData {
  title: string;
  company: string;
  location?: string;
  type: Job['type'];
  isOpen?: boolean;
  draft?: boolean;
  description?: string;
  skillsRequired?: string[];
  salary?: string;
  experienceLevel?: string;
  deadline?: string;
  requirements?: string[];
}

export interface JobSearchParams extends PaginationParams {
  search?: string;
  filters?: string; // JSON string of filter object
}

export interface CreateApplicationData {
  resumeUrl: string;
  coverLetter?: string;
}

// Backend response format: { success, message, data: { jobs } } or { success, message, data: { job } }
interface JobsResponse {
  success: boolean;
  message: string;
  data: { jobs: Job[] };
}

interface JobResponse {
  success: boolean;
  message: string;
  data: { job: Job };
}

// API Functions
export const getAllJobs = async (params?: JobSearchParams): Promise<Job[]> => {
  const response = await apiClient.get<any>('/jobs', { params });
  // Handle mixed backend response formats (Prod returns Array, Local returns Object)
  if (Array.isArray(response.data.data)) {
      return response.data.data;
  }
  return response.data.data.jobs || [];
};

export const getJob = async (id: string): Promise<Job> => {
  const response = await apiClient.get<JobResponse>(`/jobs/${id}`);
  return response.data.data.job;
};

export const createJob = async (data: CreateJobData): Promise<Job> => {
  const response = await apiClient.post<JobResponse>('/jobs', data);
  return response.data.data.job;
};

export const updateJob = async (id: string, data: Partial<CreateJobData>): Promise<Job> => {
  const response = await apiClient.put<JobResponse>(`/jobs/${id}`, data);
  return response.data.data.job;
};

export const deleteJob = async (id: string): Promise<void> => {
  await apiClient.delete(`/jobs/${id}`);
};

export const closeJobApplications = async (id: string): Promise<void> => {
  await apiClient.put(`/jobs/close-applications/${id}`);
};

// TODO: Following endpoints are NOT implemented in backend yet
// These return empty/stub data to prevent frontend crashes

export const applyToJob = async (id: string, data: CreateApplicationData): Promise<JobApplication | null> => {
  console.warn('applyToJob: /jobs/:id/apply endpoint not implemented in backend');
  return null;
};

export const bookmarkJob = async (id: string): Promise<void> => {
  console.warn('bookmarkJob: /jobs/:id/bookmark endpoint not implemented in backend');
};

export const getMyJobPostings = async (): Promise<Job[]> => {
  console.warn('getMyJobPostings: /jobs/my/posted endpoint not implemented in backend');
  return [];
};

export const getMyApplications = async (): Promise<JobApplication[]> => {
  console.warn('getMyApplications: /jobs/my/applications endpoint not implemented in backend');
  return [];
};

export const getJobApplications = async (jobId: string): Promise<JobApplication[]> => {
  console.warn('getJobApplications: /jobs/:id/applications endpoint not implemented in backend');
  return [];
};

export const updateApplicationStatus = async (
  applicationId: string, 
  status: JobApplication['status']
): Promise<JobApplication | null> => {
  console.warn('updateApplicationStatus: /applications/:id endpoint not implemented in backend');
  return null;
};

