import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import authService from '../services/authService';
import subscriptionService from '../services/subscriptionService';
import profileService from '../services/profileService'; // Add this import
import { 
  AuthContextType, 
  User, 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials,
  UserSubscription,
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

  const isAuthenticated = !!user;
  const hasActiveSubscription = !!userSubscription && 
    (userSubscription.status === 'active' || userSubscription.status === 'trialing');
  const shouldShowPlanSelection = isAuthenticated && !hasActiveSubscription;

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async (): Promise<void> => {
    try {
      console.log('🔄 Initializing authentication...');
      
      const currentUser = await authService.getCurrentUser();
      const isAuth = await authService.isAuthenticated();
      
      if (isAuth && currentUser) {
        console.log('✅ User authenticated:', currentUser.email);
        setUser(currentUser);
        
        try {
          await fetchUserSubscription();
        } catch (subscriptionError) {
          console.error('⚠️ Error fetching subscription during init:', subscriptionError);
          setUserSubscription(null);
        }
      } else {
        await authService.logout();
        setUser(null);
        setUserSubscription(null);
      }
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      await authService.logout();
      setUser(null);
      setUserSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubscription = async (): Promise<void> => {
    try {
      console.log('🔄 Fetching user subscription...');
      const subscription = await subscriptionService.getCurrentSubscription();
      
      console.log('📊 Subscription data:', subscription);
      setUserSubscription(subscription);
      
      if (user) {
        const hasActive = !!subscription && 
          (subscription.status === 'active' || subscription.status === 'trialing');
        
        setUser({
          ...user,
          hasActiveSubscription: hasActive
        });

        console.log('✅ User subscription status:', {
          hasActive,
          status: subscription?.status || 'none'
        });
      }
    } catch (error) {
      console.error('❌ Error fetching subscription:', error);
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
      console.log('🔄 Signing up user...');
      const result = await authService.register(credentials);
      
      if (result.success && result.user) {
        const userWithSubscription = {
          ...result.user,
          hasActiveSubscription: false
        };
        setUser(userWithSubscription);
        setUserSubscription(null);
        console.log('✅ User signed up successfully');
      }
      
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      console.error('❌ Sign up error:', errorMessage);
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
      console.log('🔄 Signing in user...');
      const result = await authService.login(credentials);
      
      if (result.success && result.user) {
        const userWithDefaultSubscription = {
          ...result.user,
          hasActiveSubscription: false
        };
        setUser(userWithDefaultSubscription);
        setUserSubscription(null);
        
        await fetchUserSubscription();
        console.log('✅ User signed in successfully');
      }
      
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      console.error('❌ Sign in error:', errorMessage);
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
      console.log('🔄 Signing out user...');
      await authService.logout();
      setUser(null);
      setUserSubscription(null);
      clearError();
      console.log('✅ User signed out successfully');
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Logout failed';
      setError(errorMessage);
      console.error('❌ Sign out error:', errorMessage);
      return { success: false };
    } finally {
      setAuthLoading(false);
    }
  };

  const refreshUserSubscription = async (): Promise<void> => {
    try {
      console.log('🔄 Refreshing user subscription...');
      const subscription = await subscriptionService.getCurrentSubscription();
      
      console.log('📊 Refreshed subscription:', {
        id: subscription?.id,
        status: subscription?.status,
        planId: subscription?.planId
      });

      setUserSubscription(subscription);
      
      if (user) {
        const hasActive = !!subscription && 
          (subscription.status === 'active' || subscription.status === 'trialing');
        
        const updatedUser = {
          ...user,
          hasActiveSubscription: hasActive
        };
        setUser(updatedUser);
        
        console.log('✅ Subscription refreshed:', {
          hasActiveSubscription: hasActive,
          subscriptionStatus: subscription?.status || 'none'
        });
      }
    } catch (error) {
      console.error('❌ Error refreshing subscription:', error);
      throw error;
    }
  };

  const completeSubscription = async (subscriptionId: string): Promise<void> => {
    try {
      if (subscriptionId === 'free') {
        console.log('🆓 Activating free subscription...');
        const freeSubscription: UserSubscription = {
          id: 'free-subscription',
          planId: 'free',
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false
        };
        
        setUserSubscription(freeSubscription);
        
        if (user) {
          setUser({
            ...user,
            hasActiveSubscription: true
          });
        }
        console.log('✅ Free subscription activated');
        return;
      }

      // For paid subscriptions, refresh from backend
      console.log('💳 Completing paid subscription...');
      await refreshUserSubscription();
      console.log('✅ Paid subscription completed');
    } catch (error) {
      console.error('❌ Error completing subscription:', error);
      throw error;
    }
  };

  const createSubscriptionPayment = async (priceId: string): Promise<{ 
    clientSecret: string; 
    subscriptionId: string 
  }> => {
    try {
      console.log('💰 Creating subscription payment:', priceId);
      const paymentIntent = await subscriptionService.createSubscription(priceId);
      
      console.log('✅ Payment intent created:', {
        subscriptionId: paymentIntent.subscriptionId,
        status: paymentIntent.status
      });

      return {
        clientSecret: paymentIntent.clientSecret,
        subscriptionId: paymentIntent.subscriptionId!
      };
    } catch (error) {
      console.error('❌ Error creating subscription payment:', error);
      throw error;
    }
  };

  // Profile-related methods
  const updateUserProfile = async (updatedUser: User): Promise<void> => {
    setUser(updatedUser);
    console.log('✅ User profile updated');
  };
  
  // const uploadProfileImage = async (imageData: string): Promise<void> => {
  //   try {
  //     console.log('🔄 Uploading profile image...');
  //     const updatedUser = await profileService.uploadProfileImage(imageData);
  //     console.log('✅ Profile image uploaded successfully');
  //     console.log('👤 Updated user:', {
  //       id: updatedUser.id,
  //       email: updatedUser.email,
  //       profileImage: updatedUser.profileImage,
  //       hasProfileImage: !!updatedUser.profileImage
  //     });
  //     setUser(updatedUser);
  //     console.log('✅ Profile image uploaded successfully');
  //   } catch (error) {
  //     console.error('❌ Error uploading profile image:', error);
  //     throw error;
  //   }
  // };
  // In AuthContext - update uploadProfileImage
const uploadProfileImage = async (imageData: string): Promise<void> => {
  try {
    console.log('🔄 Starting profile image upload in AuthContext...');
    
    const updatedUser = await profileService.uploadProfileImage(imageData);
    
    // console.log('🔍 Updated user from service:', JSON.stringify(updatedUser, null, 2));
    // console.log('🔍 Updated user profileImage:', updatedUser.profileImage);
    // console.log('🔍 Updated user keys:', Object.keys(updatedUser));
    
    setUser(updatedUser);
    console.log('✅ User state updated in context');
    
  } catch (error) {
    console.error('❌ Error in uploadProfileImage:', error);
    throw error;
  }
};
  const deleteProfileImage = async (): Promise<void> => {
    try {
      console.log('🔄 Deleting profile image...');
      const updatedUser = await profileService.deleteProfileImage();
      setUser(updatedUser);
      console.log('✅ Profile image deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting profile image:', error);
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
    // updateUserProfile,
    uploadProfileImage,
    deleteProfileImage,
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