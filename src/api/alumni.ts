import apiClient, { ApiResponse, PaginationParams, PaginatedResponse } from './apiClient';

// Types
export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  portfolio?: string;
}

export interface AlumniRelation {
  department: string;
  faculty: string;
  university: string;
  batch: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  current: boolean;
}

export interface AlumniProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  degree: string;
  major: string;
  faculty: string;
  gradYear: string;
  currentRole?: string;
  currentCompany?: string;
  location?: string;
  socials: SocialLinks;
  alumniRelation: AlumniRelation;
  latestDegree?: string;
  interests: string[];
  skills: string[];
  experiences: Experience[];
  education: Education[];
  isVerified: boolean;
  connectionStatus?: 'connected' | 'pending' | 'none';
}

export interface AlumniSearchParams extends PaginationParams {
  query?: string;
  gradYear?: string;
  department?: string;
  location?: string;
  company?: string;
}

// Mock data for development
const MOCK_PROFILE: AlumniProfile = {
  id: '1',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '+91 98765 43210',
  avatarUrl: '/profile.jpeg',
  bio: 'Passionate software engineer with 8+ years of experience building scalable web applications. Love mentoring young developers and contributing to open source.',
  degree: 'B.Tech',
  major: 'Computer Science',
  faculty: 'Engineering',
  gradYear: '2016',
  currentRole: 'Senior Software Engineer',
  currentCompany: 'Google India',
  location: 'Bangalore, India',
  socials: {
    linkedin: 'https://linkedin.com/in/rahulsharma',
    github: 'https://github.com/rahulsharma',
    twitter: 'https://twitter.com/rahulsharma',
    portfolio: 'https://rahulsharma.dev',
  },
  alumniRelation: {
    department: 'Computer Science',
    faculty: 'Faculty of Engineering',
    university: 'Delhi University',
    batch: '2012-2016',
  },
  latestDegree: 'M.Tech Computer Science (IIT Delhi)',
  interests: ['Machine Learning', 'Web Development', 'Open Source', 'Mentorship'],
  skills: ['React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'System Design'],
  experiences: [
    {
      id: '1',
      company: 'Google India',
      role: 'Senior Software Engineer',
      startDate: '2020-06',
      current: true,
      description: 'Leading frontend development for Google Pay India',
    },
    {
      id: '2',
      company: 'Microsoft',
      role: 'Software Engineer',
      startDate: '2016-07',
      endDate: '2020-05',
      current: false,
      description: 'Worked on Azure DevOps platform',
    },
  ],
  education: [
    {
      id: '1',
      institution: 'IIT Delhi',
      degree: 'M.Tech',
      field: 'Computer Science',
      startYear: 2018,
      endYear: 2020,
      current: false,
    },
    {
      id: '2',
      institution: 'Delhi University',
      degree: 'B.Tech',
      field: 'Computer Science',
      startYear: 2012,
      endYear: 2016,
      current: false,
    },
  ],
  isVerified: true,
};

const MOCK_ALUMNI_LIST: AlumniProfile[] = [
  MOCK_PROFILE,
  {
    ...MOCK_PROFILE,
    id: '2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    currentRole: 'Product Manager',
    currentCompany: 'Amazon',
    gradYear: '2017',
    location: 'Hyderabad, India',
    avatarUrl: '',
  },
  {
    ...MOCK_PROFILE,
    id: '3',
    name: 'Arjun Singh',
    email: 'arjun.singh@example.com',
    currentRole: 'Data Scientist',
    currentCompany: 'Flipkart',
    gradYear: '2018',
    location: 'Bangalore, India',
    avatarUrl: '',
  },
  {
    ...MOCK_PROFILE,
    id: '4',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    currentRole: 'UX Designer',
    currentCompany: 'Swiggy',
    gradYear: '2019',
    location: 'Bangalore, India',
    avatarUrl: '',
  },
  {
    ...MOCK_PROFILE,
    id: '5',
    name: 'Vikram Malhotra',
    email: 'vikram.m@example.com',
    currentRole: 'Engineering Manager',
    currentCompany: 'Razorpay',
    gradYear: '2015',
    location: 'Bangalore, India',
    avatarUrl: '',
  },
];

// Backend response format: { success, data } (alumni uses standard wrapper)
interface AlumniResponse {
  success: boolean;
  data: AlumniProfile | AlumniProfile[];
  message?: string;
}

// API Functions
export const getAlumniProfile = async (id: string): Promise<AlumniProfile> => {
  const response = await apiClient.get<AlumniResponse>(`/alumni/${id}`);
  const data = response.data.data as any; // Cast to any to handle raw backend structure

  // If data already matches AlumniProfile (mock or correctly shaped), return it
  if (data && data.socials && data.alumniRelation) {
    return data as AlumniProfile;
  }

  // Map nested backend structure to flat frontend interface
  const profileDetails = data.profileDetails || {};
  
  return {
    id: data._id || data.id,
    name: data.name,
    email: data.email,
    phone: profileDetails.phone || '',
    avatarUrl: data.avatarUrl || '/profile.jpeg', // Fallback
    bio: '', // Not in backend yet
    degree: 'Unknown Degree', // Not in backend yet (only degreeUrl)
    major: profileDetails.branch || profileDetails.major || '',
    faculty: '', // Not in backend explicitly
    gradYear: profileDetails.graduationYear ? String(profileDetails.graduationYear) : '',
    currentRole: profileDetails.designation || '',
    currentCompany: profileDetails.company || '',
    location: profileDetails.location || '',
    socials: {
      linkedin: profileDetails.linkedin || '',
      github: '',
      twitter: '',
      portfolio: ''
    },
    alumniRelation: {
      department: profileDetails.branch || '',
      faculty: '',
      university: '',
      batch: profileDetails.graduationYear ? String(profileDetails.graduationYear) : ''
    },
    latestDegree: '', 
    interests: profileDetails.skills || [],
    skills: profileDetails.skills || [],
    experiences: [], // Not in backend yet
    education: [], // Not in backend yet
    isVerified: data.userType === 'Alumni',
    connectionStatus: 'none'
  };
};

export const getMyProfile = async (userId: string): Promise<AlumniProfile> => {
  // Backend doesn't have /alumni/me - use /alumni/:id with current user's ID
  // The userId should be obtained from the decoded JWT token (see auth.ts verifyAlumni)
  const response = await apiClient.get<AlumniResponse>(`/alumni/${userId}`);
  return response.data.data as AlumniProfile;
};

export const updateAlumniProfile = async (id: string, data: Partial<AlumniProfile>): Promise<AlumniProfile> => {
  const response = await apiClient.put<AlumniResponse>(`/alumni/${id}`, data);
  return response.data.data as AlumniProfile;
};

export const getAlumniDirectory = async (params?: AlumniSearchParams): Promise<AlumniProfile[]> => {
  // Backend returns array, not paginated response
  // Backend supports ?search=query and ?keys=field1,field2
  const response = await apiClient.get<AlumniResponse>('/alumni', { params });
  return (response.data.data as AlumniProfile[]) || [];
};

export const searchAlumni = async (query: string): Promise<AlumniProfile[]> => {
  // Backend doesn't have /alumni/search - use /alumni?search=query
  const response = await apiClient.get<AlumniResponse>('/alumni', { params: { search: query } });
  return (response.data.data as AlumniProfile[]) || [];
};

// TODO: Not implemented in backend
export const getConnectionSuggestions = async (): Promise<AlumniProfile[]> => {
  console.warn('getConnectionSuggestions: /alumni/suggestions endpoint not implemented in backend');
  return [];
};
