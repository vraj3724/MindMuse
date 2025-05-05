import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    config.headers.Authorization = formattedToken;
    console.log('Authorization header:', config.headers.Authorization.substring(0, 20) + '...');
  } else {
    console.warn('No token found in localStorage');
  }
  return config;
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication error:', {
        status: error.response.status,
        message: error.response.data?.message || 'Unauthorized',
        headers: error.response.headers,
        config: {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers
        }
      });
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Login successful, token stored');
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Registration successful, token stored');
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  },
};

export const entryService = {
  getAll: async () => {
    try {
      const response = await api.get('/entries');
      return response.data;
    } catch (error) {
      console.error('Get entries error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        headers: error.response?.headers
      });
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/entries/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get entry error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        headers: error.response?.headers
      });
      throw error;
    }
  },
  create: async (entryData) => {
    try {
      const response = await api.post('/entries', entryData);
      return response.data;
    } catch (error) {
      console.error('Create entry error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        headers: error.response?.headers
      });
      throw error;
    }
  },
  update: async (id, entryData) => {
    try {
      const response = await api.put(`/entries/${id}`, entryData);
      return response.data;
    } catch (error) {
      console.error('Update entry error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        headers: error.response?.headers
      });
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/entries/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete entry error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        headers: error.response?.headers
      });
      throw error;
    }
  },
  
};

export default api;
