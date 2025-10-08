import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials, 
  User 
} from '../types/auth';

class AuthService {
  // Register new user
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      console.log('Registering user...');
      const response = await api.post<AuthResponse>('/auth/register', {
        email: credentials.email.toLowerCase().trim(),
        password: credentials.password
      });

      console.log(' Registration response:', response.data);

      if (response.data.success && response.data.token && response.data.user) {
        await this.storeAuthData(response.data.token, response.data.user);
        console.log('Auth data stored successfully');
      }

      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Logging in user...');
      const response = await api.post<AuthResponse>('/auth/login', {
        email: credentials.email.toLowerCase().trim(),
        password: credentials.password
      });

      console.log('Login response:', response.data);

      if (response.data.success && response.data.token && response.data.user) {
        await this.storeAuthData(response.data.token, response.data.user);
        console.log('💾 Auth data stored successfully');
      }

      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Login failed. Please check your credentials.';
      throw new Error(errorMessage);
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      console.log('Logging out user...');
      await AsyncStorage.multiRemove(['userToken', 'userData']);
      console.log('User data cleared from storage');
    } catch (error) {
      console.warn('Error during logout:', error);
      throw new Error('Logout failed');
    }
  }

  // Get current user with validation
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const token = await AsyncStorage.getItem('userToken');
      
      if (!userData || !token) {
        console.log('No user data or token found');
        return null;
      }

      const user: User = JSON.parse(userData);
      console.log('📱 Retrieved user from storage:', user.email);
      return user;
    } catch (error) {
      console.warn('Error getting current user:', error);
      // Clear corrupted data
      await this.logout();
      return null;
    }
  }

  // Get auth token
  async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('No token found in storage');
        return null;
      }
      console.log('Token retrieved from storage');
      return token;
    } catch (error) {
      console.warn('Error getting token:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      const hasToken = !!token;
      console.log('Authentication check:', hasToken ? 'Authenticated' : 'Not authenticated');
      return hasToken;
    } catch (error) {
      console.warn('Error checking authentication:', error);
      return false;
    }
  }

  // Test backend connection
  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing backend connection...');
      const response = await api.get('/health');
      console.log('Backend connection successful:', response.data);
      return true;
    } catch (error: any) {
      console.error('Backend connection failed:', error.message);
      return false;
    }
  }

  // Private method to store auth data
  private async storeAuthData(token: string, user: User): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        ['userToken', token],
        ['userData', JSON.stringify(user)]
      ]);
      console.log('Auth data stored in AsyncStorage');
    } catch (error) {
      console.warn('Error storing auth data:', error);
      throw new Error('Failed to save authentication data');
    }
  }
}

export default new AuthService();