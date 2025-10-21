// API Client for EasyPrep Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; errors?: any[] }> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from localStorage
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('easyprep_token') 
    : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error: any) {
    console.error('API Error:', error);
    return {
      success: false,
      message: error.message || 'Network error',
    };
  }
}

// Authentication API
export const authAPI = {
  // Student signup
  signupStudent: async (data: {
    name: string;
    email: string;
    username: string;
    department: string;
    password: string;
  }) => {
    return apiCall<{ userId: number }>('/auth/signup/student', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Staff signup (coordinator/admin)
  signupStaff: async (data: {
    name: string;
    email: string;
    username: string;
    department: string;
    password: string;
  }) => {
    return apiCall<{ userId: number; role: string }>('/auth/signup/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Coordinator signup
  signupCoordinator: async (data: {
    name: string;
    email: string;
    username: string;
    department: string;
    password: string;
  }) => {
    return apiCall<{ userId: number }>('/auth/signup/coordinator', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Admin signup
  signupAdmin: async (data: {
    name: string;
    email: string;
    username: string;
    department: string;
    password: string;
  }) => {
    return apiCall<{ userId: number }>('/auth/signup/admin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Login
  login: async (data: { username: string; password: string }) => {
    const result = await apiCall<{
      token: string;
      user: {
        id: number;
        name: string;
        email: string;
        username: string;
        department: string;
        role: 'student' | 'moderator' | 'admin';
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Store token and user data
    if (result.success && result.data) {
      localStorage.setItem('easyprep_token', result.data.token);
      localStorage.setItem('easyprep_user', JSON.stringify(result.data.user));
    }

    return result;
  },

  // Verify OTP
  verifyOTP: async (data: { userId: number; otp: string }) => {
    return apiCall<{ message: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Resend OTP
  resendOTP: async (userId: number) => {
    return apiCall<{ message: string }>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem('easyprep_token');
    localStorage.removeItem('easyprep_user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('easyprep_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('easyprep_token');
  },
};

// Company API
export const companyAPI = {
  // Get all companies
  getAll: async (filters?: { status?: string; search?: string }) => {
    const query = filters ? `?${new URLSearchParams(filters)}` : '';
    return apiCall(`/companies${query}`, { method: 'GET' });
  },

  // Get company by ID
  getById: async (id: string) => {
    return apiCall(`/companies/${id}`, { method: 'GET' });
  },

  // Create company with file uploads
  create: async (formData: FormData) => {
    const url = `${API_BASE_URL}/companies`;
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('easyprep_token') 
      : null;

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData, // Don't set Content-Type, let browser set it with boundary
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create company');
      }

      return data;
    } catch (error: any) {
      console.error('Create company error:', error);
      return {
        success: false,
        message: error.message || 'Network error',
      };
    }
  },

  // Update company with file uploads
  update: async (id: string, formData: FormData) => {
    const url = `${API_BASE_URL}/companies/${id}`;
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('easyprep_token') 
      : null;

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update company');
      }

      return data;
    } catch (error: any) {
      console.error('Update company error:', error);
      return {
        success: false,
        message: error.message || 'Network error',
      };
    }
  },

  // Delete company
  delete: async (id: string) => {
    return apiCall(`/companies/${id}`, { method: 'DELETE' });
  },

  // Get eligible students for a company
  getEligibleStudents: async (id: string) => {
    return apiCall(`/companies/${id}/eligible-students`, { method: 'GET' });
  },

  // Download Excel template
  downloadTemplate: async () => {
    const url = `${API_BASE_URL}/companies/template`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to download template');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'eligible_students_template.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      return { success: true };
    } catch (error: any) {
      console.error('Download template error:', error);
      return {
        success: false,
        message: error.message || 'Failed to download template',
      };
    }
  },
};

// Question API (for future use)
export const questionAPI = {
  getAll: async (filters?: any) => {
    const query = filters ? `?${new URLSearchParams(filters)}` : '';
    return apiCall(`/questions${query}`, { method: 'GET' });
  },

  getById: async (id: string) => {
    return apiCall(`/questions/${id}`, { method: 'GET' });
  },

  create: async (data: any) => {
    return apiCall('/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiCall(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiCall(`/questions/${id}`, { method: 'DELETE' });
  },

  approve: async (id: string) => {
    return apiCall(`/questions/${id}/approve`, {
      method: 'PATCH',
    });
  },

  reject: async (id: string, reason?: string) => {
    return apiCall(`/questions/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },

  save: async (id: string) => {
    return apiCall(`/questions/${id}/save`, {
      method: 'POST',
    });
  },

  unsave: async (id: string) => {
    return apiCall(`/questions/${id}/unsave`, {
      method: 'DELETE',
    });
  },

  getSaved: async () => {
    return apiCall('/questions/saved', { method: 'GET' });
  },
};

export default { authAPI, companyAPI, questionAPI };
