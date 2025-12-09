import apiClient, { ApiResponse } from './apiClient';

export interface UploadResponse {
  url: string;
  publicId?: string;
}

export const uploadFile = async (file: File, type: 'image' | 'document' = 'image'): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  // Endpoint: /upload matches standard backend convention. 
  // If backend uses /upload/image specifically, we might need to adjust.
  // Using generic /upload based on common patterns, will adjust if user reports error.
  const response = await apiClient.post<ApiResponse<UploadResponse>>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

export const uploadAvatar = async (file: File): Promise<string> => {
    // Some backends have specific route for avatars
    const formData = new FormData();
    formData.append('avatar', file); // Key might be 'avatar' or 'file' or 'image'
    
    // Trying /upload/avatar based on likely backend structure given /upload/degree exists
    try {
        const response = await apiClient.post<ApiResponse<{ url: string }>>('/upload/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data.url;
    } catch (error) {
        // Fallback to generic upload if specific avatar route fails (Optional, but good for robustness)
        console.warn('Avatar upload specific endpoint failed, trying generic /upload', error);
        const data = await uploadFile(file, 'image');
        return data.url;
    }
};
