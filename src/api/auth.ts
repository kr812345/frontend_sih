import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * STANDARDIZED PORTS CONFIGURATION
 * Backend: http://localhost:5000
 * Frontend: http://localhost:3001
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // increase timeout slightly and use retries in the verify call
    timeout: 15000,
});

// Add a request interceptor to include the auth token if available
api.interceptors.request.use(
    (config) => {
        // Check client-side only to avoid build errors
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear token and redirect to login
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterAlumniData {
    name: string;
    username: string; // Required by backend
    email: string;
    password: string;
    graduationYear: number;
    degreeUrl: string;
    collegeId: string;
}

export interface User {
    id?: string;
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
    userType?: string;
    graduationYear?: number;
    degreeUrl?: string;
    collegeId?: string;
}

export interface AuthResponse {
    success: boolean;
    data?: {
        token?: string;
        user?: User;
    };
    token?: string;
    message?: string;
}

// Helper to decode JWT token payload (without verification - for client-side use only)
const decodeToken = (token: string): { userId: string; userType: string; collegeId: string } | null => {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch {
        return null;
    }
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    // Backend returns: { success: true, data: { token }, message: "..." }
    const token = response.data.data?.token || response.data.token;
    if (token) {
        localStorage.setItem('token', token);
    }
    return response.data;
};

export const registerAlumni = async (data: RegisterAlumniData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register/alumni', data);
    return response.data;
};

export const verifyAlumni = async (): Promise<User | null> => {
    // Backend doesn't have /auth/me endpoint - decode token locally instead
    if (typeof window === 'undefined') {
        return null;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }
    
    const decoded = decodeToken(token);
    if (!decoded) {
        localStorage.removeItem('token');
        return null;
    }
    
    // Return user info from token payload
    return {
        id: decoded.userId,
        _id: decoded.userId,
        userType: decoded.userType,
        collegeId: decoded.collegeId,
    };
};

export default api;
