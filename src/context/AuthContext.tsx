import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import authService from '../services/authService';
import { 
  AuthContextType, 
  User, 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials 
} from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async (): Promise<void> => {
    try {
      console.log('Initializing authentication...');
      
      // Check if user data exists in storage
      const currentUser = await authService.getCurrentUser();
      const isAuthenticated = await authService.isAuthenticated();
      
      console.log('Stored user:', currentUser);
      console.log('Is authenticated:', isAuthenticated);
      
      if (isAuthenticated && currentUser) {
        console.log('User found, setting authenticated state');
        setUser(currentUser);
      } else {
        console.log('No user found or token invalid');
        // Clear any invalid data
        await authService.logout();
        setUser(null);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Clear any corrupted data
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
      console.log('🏁 Auth initialization complete');
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const signUp = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    setAuthLoading(true);
    clearError();
    
    try {
      console.log('Attempting registration...');
      const result = await authService.register(credentials);
      
      if (result.success && result.user) {
        console.log('Registration successful, setting user');
        setUser(result.user);
      }
      
      return result;
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage 
      };
    } finally {
      setAuthLoading(false);
    }
  };

  const signIn = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setAuthLoading(true);
    clearError();
    
    try {
      console.log('Attempting login...');
      const result = await authService.login(credentials);
      
      if (result.success && result.user) {
        console.log('Login successful, setting user');
        setUser(result.user);
      }
      
      return result;
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage 
      };
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async (): Promise<{ success: boolean }> => {
    setAuthLoading(true);
    
    try {
      console.log('Attempting logout...');
      await authService.logout();
      setUser(null);
      clearError();
      console.log('Logout successful');
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      const errorMessage = error.message || 'Logout failed';
      setError(errorMessage);
      return { success: false };
    } finally {
      setAuthLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    authLoading,
    error,
    signUp,
    signIn,
    signOut,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};