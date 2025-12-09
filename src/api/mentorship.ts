import apiClient, { ApiResponse } from './apiClient';

// Types
export interface Mentor {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  profileDetails?: {
    skills?: string[];
    interests?: string[];
    designation?: string;
    company?: string;
    linkedin?: string;
  };
}

export interface Mentorship {
  _id: string;
  mentorId: Mentor;
  menteeId: {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  message?: string;
  topics: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  requestedAt: string;
  respondedAt?: string;
}

export interface RequestMentorshipData {
  mentorId: string;
  message?: string;
  topics?: string[];
}

// API Functions

// Get available mentors (alumni)
export const getAvailableMentors = async (): Promise<Mentor[]> => {
  const response = await apiClient.get<ApiResponse<{ mentors: Mentor[] }>>('/mentorships/mentors');
  return response.data.data?.mentors || [];
};

// Get my mentorships (as mentor or mentee)
export const getMyMentorships = async (): Promise<{
  asMentor: Mentorship[];
  asMentee: Mentorship[];
  all: Mentorship[];
}> => {
  const response = await apiClient.get<ApiResponse<{
    asMentor: Mentorship[];
    asMentee: Mentorship[];
    all: Mentorship[];
  }>>('/mentorships/my');
  return response.data.data;
};

// Get pending mentorship requests (for mentors)
export const getPendingMentorshipRequests = async (): Promise<Mentorship[]> => {
  const response = await apiClient.get<ApiResponse<{ requests: Mentorship[] }>>('/mentorships/requests');
  return response.data.data.requests || [];
};

// Request mentorship from an alumni (for students)
export const requestMentorship = async (data: RequestMentorshipData): Promise<Mentorship> => {
  const response = await apiClient.post<ApiResponse<{ mentorship: Mentorship }>>('/mentorships/request', data);
  return response.data.data.mentorship;
};

// Accept mentorship request (for mentors)
export const acceptMentorship = async (mentorshipId: string): Promise<Mentorship> => {
  const response = await apiClient.post<ApiResponse<{ mentorship: Mentorship }>>(`/mentorships/accept/${mentorshipId}`);
  return response.data.data.mentorship;
};

// Reject mentorship request (for mentors)
export const rejectMentorship = async (mentorshipId: string): Promise<Mentorship> => {
  const response = await apiClient.post<ApiResponse<{ mentorship: Mentorship }>>(`/mentorships/reject/${mentorshipId}`);
  return response.data.data.mentorship;
};
