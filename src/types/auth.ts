// User related types
// export interface User {
//     id: string;
//     email: string;
//     watchlist: WatchlistItem[];
//   }
  
  export interface WatchlistItem {
    movieId: number;
    title: string;
    posterPath?: string;
    mediaType: 'movie' | 'tv';
    addedAt: string;
  }
  
  // Authentication response types
  // export interface AuthResponse {
  //   success: boolean;
  //   message: string;
  //   token?: string;
  //   user?: User;
  //   expiresIn?: string;
  // }
  
  // Credential types
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    email: string;
    password: string;
  }
  
  // Auth Context types
  export interface AuthContextType {
    user: User | null;
    userSubscription: UserSubscription | null;
    loading: boolean;
    authLoading: boolean;
    error: string | null;
    signUp: (credentials: RegisterCredentials) => Promise<AuthResponse>;
    signIn: (credentials: LoginCredentials) => Promise<AuthResponse>;
    signOut: () => Promise<{ success: boolean }>;
    clearError: () => void;
    refreshUserSubscription: () => Promise<void>;
    completeSubscription: (subscriptionId: string) => Promise<void>;
    createSubscriptionPayment: (priceId: string) => Promise<{ clientSecret: string; subscriptionId: string }>;
    isAuthenticated: boolean;
    hasActiveSubscription: boolean;
  }
  
  // API Error types
  export interface ApiError {
    message: string;
    code?: string;
    status?: number;
  }
  
  // Service types
  export interface AuthService {
    register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    getCurrentUser: () => Promise<User | null>;
    getToken: () => Promise<string | null>;
    isAuthenticated: () => Promise<boolean>;
    testConnection: () => Promise<boolean>;
  }

  export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: 'month' | 'year';
    features: string[];
    stripePriceId?: string;
    isFree: boolean;
  }
  
  export interface UserSubscription {
    id: string;
    planId: string;
    status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    stripeSubscriptionId?: string;
  }
  
  export interface User {
    id: string;
    email: string;
    subscription?: UserSubscription;
    hasActiveSubscription: boolean;
    watchlist: WatchlistItem[];
  }
  
  export interface PaymentIntent {
    clientSecret: string;
    subscriptionId?: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
    token?: string;
    requiresSubscription?: boolean;
  }