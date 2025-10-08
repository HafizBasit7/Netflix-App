// User related types
export interface User {
    id: string;
    email: string;
    watchlist: WatchlistItem[];
  }
  
  export interface WatchlistItem {
    movieId: number;
    title: string;
    posterPath?: string;
    mediaType: 'movie' | 'tv';
    addedAt: string;
  }
  
  // Authentication response types
  export interface AuthResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: User;
    expiresIn?: string;
  }
  
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
    loading: boolean;
    authLoading: boolean;
    error: string | null;
    signUp: (credentials: RegisterCredentials) => Promise<AuthResponse>;
    signIn: (credentials: LoginCredentials) => Promise<AuthResponse>;
    signOut: () => Promise<{ success: boolean }>;
    clearError: () => void;
    isAuthenticated: boolean;
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