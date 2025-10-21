// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

// API client with error handling
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint: string, options: RequestOptions = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('easyprep_token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  get(endpoint: string, options: RequestOptions = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint: string, body: any, options: RequestOptions = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint: string, body: any, options: RequestOptions = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint: string, options: RequestOptions = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();

// Auth API endpoints
export const authAPI = {
  // Student Signup
  signupStudent: async (data: any) => {
    return api.post('/api/auth/signup/student', data);
  },

  // Staff Signup (Coordinator/Admin)
  signupStaff: async (data: any) => {
    return api.post('/api/auth/signup/coordinator', data);
  },

  // Verify OTP
  verifyOTP: async (data: any) => {
    return api.post('/api/auth/verify-otp', data);
  },

  // Resend OTP
  resendOTP: async (data: any) => {
    return api.post('/api/auth/resend-otp', data);
  },

  // Login
  login: async (credentials: any) => {
    return api.post('/api/auth/login', credentials);
  },

  // Get current user
  getCurrentUser: async () => {
    return api.get('/api/auth/me');
  },

  // Logout
  logout: () => {
    localStorage.removeItem('easyprep_token');
    localStorage.removeItem('easyprep_user');
  }
};

export default api;
