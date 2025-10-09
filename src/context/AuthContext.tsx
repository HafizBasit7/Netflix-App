import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import authService from '../services/authService';
import subscriptionService from '../services/subscriptionService';
import { 
  AuthContextType, 
  User, 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials,
  UserSubscription,
  SubscriptionPlan
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
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate derived state
  const isAuthenticated = !!user;
  const hasActiveSubscription = !!user && user.hasActiveSubscription;
  const shouldShowPlanSelection = isAuthenticated && !hasActiveSubscription;

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async (): Promise<void> => {
    try {
      console.log('Initializing authentication...');
      
      const currentUser = await authService.getCurrentUser();
      const isAuthenticated = await authService.isAuthenticated();
      
      if (isAuthenticated && currentUser) {
        console.log('User found, setting authenticated state');
        setUser(currentUser);
        
        // Fetch user subscription status with proper error handling
        try {
          await fetchUserSubscription();
        } catch (subscriptionError) {
          console.error('Error fetching subscription:', subscriptionError);
          // Even if subscription fetch fails, user should still be logged in
          setUserSubscription(null);
        }
      } else {
        await authService.logout();
        setUser(null);
        setUserSubscription(null);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      await authService.logout();
      setUser(null);
      setUserSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubscription = async (): Promise<void> => {
    try {
      const subscription = await subscriptionService.getCurrentSubscription();
      console.log('Fetched subscription:', subscription);
      
      setUserSubscription(subscription);
      
      // Update user's subscription status
      if (user) {
        const updatedUser = {
          ...user,
          hasActiveSubscription: !!subscription && 
            (subscription.status === 'active' || subscription.status === 'trialing')
        };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const signUp = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    setAuthLoading(true);
    clearError();
    
    try {
      const result = await authService.register(credentials);
      
      if (result.success && result.user) {
        const userWithSubscription = {
          ...result.user,
          hasActiveSubscription: false
        };
        setUser(userWithSubscription);
        setUserSubscription(null);
      }
      
      return result;
    } catch (error: any) {
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
      const result = await authService.login(credentials);
      
      if (result.success && result.user) {
        const userWithDefaultSubscription = {
          ...result.user,
          hasActiveSubscription: false // Default to false, will be updated by fetch
        };
        setUser(userWithDefaultSubscription);
        
        // Ensure subscription is fetched and set
        await fetchUserSubscription();
      }
      
      return result;
    } catch (error: any) {
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
      await authService.logout();
      setUser(null);
      setUserSubscription(null);
      clearError();
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Logout failed';
      setError(errorMessage);
      return { success: false };
    } finally {
      setAuthLoading(false);
    }
  };

  const refreshUserSubscription = async (): Promise<void> => {
    try {
      const subscription = await subscriptionService.getCurrentSubscription();
      setUserSubscription(subscription);
      
      if (user) {
        const updatedUser = {
          ...user,
          hasActiveSubscription: !!subscription && 
            (subscription.status === 'active' || subscription.status === 'trialing')
        };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error refreshing subscription:', error);
      throw error;
    }
  };

  const completeSubscription = async (subscriptionId: string): Promise<void> => {
    try {
      if (subscriptionId === 'free') {
        // Handle free subscription locally
        const freeSubscription: UserSubscription = {
          id: 'free-subscription',
          planId: 'free',
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false
        };
        
        setUserSubscription(freeSubscription);
        
        if (user) {
          const updatedUser = {
            ...user,
            hasActiveSubscription: true
          };
          setUser(updatedUser);
        }
        return;
      }

      // For paid subscriptions, refresh from backend to get actual status
      await refreshUserSubscription();
    } catch (error) {
      console.error('Error completing subscription:', error);
      throw error;
    }
  };

  const createSubscriptionPayment = async (priceId: string): Promise<{ clientSecret: string; subscriptionId: string }> => {
    try {
      const paymentIntent = await subscriptionService.createSubscription(priceId);
      return {
        clientSecret: paymentIntent.clientSecret,
        subscriptionId: paymentIntent.subscriptionId!
      };
    } catch (error) {
      console.error('Error creating subscription payment:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userSubscription,
    loading,
    authLoading,
    error,
    signUp,
    signIn,
    signOut,
    clearError,
    refreshUserSubscription,
    completeSubscription,
    createSubscriptionPayment,
    isAuthenticated,
    hasActiveSubscription,
    shouldShowPlanSelection
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};