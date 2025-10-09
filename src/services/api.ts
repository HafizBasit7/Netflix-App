import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, User } from '../types/auth';

// API Configuration
// const API_BASE_URL = __DEV__ 
//   ? 'http://localhost:5000/api'  // Development - Android emulator
//   : 'https://your-production-url.com/api'; // Production

  const API_BASE_URL = 'http://192.168.18.24:5000/api';
  
// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Error retrieving token:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle token expiration (401 errors)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear stored auth data
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      
      // You could implement token refresh logic here if needed
    }

    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
      throw new Error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

export default api;