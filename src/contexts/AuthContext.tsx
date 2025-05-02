import { createContext, useState, useEffect, ReactNode } from 'react';
import supabase from '../services/supabase';
import { 
  User as SupabaseUser,
  AuthError, 
  AuthResponse,
  AuthTokenResponse,
  Session
} from '@supabase/supabase-js';

interface AuthContextType {
  currentUser: SupabaseUser | null;
  loading: boolean;
  signUp: (email: string, password: string, options?: { displayName?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmEmailVerification: (token: string) => Promise<void>;
  confirmResetPassword: (token: string, newPassword: string) => Promise<void>;
  updateUserProfile: (data: { displayName?: string; avatarUrl?: string }) => Promise<void>;
  instagramConnected: boolean;
  connectInstagram: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
  isEmailVerified: boolean;
  requireVerification: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  sendVerificationEmail: async () => {},
  resetPassword: async () => {},
  confirmEmailVerification: async () => {},
  confirmResetPassword: async () => {},
  updateUserProfile: async () => {},
  instagramConnected: false,
  connectInstagram: async () => {},
  authError: null,
  clearAuthError: () => {},
  isEmailVerified: false,
  requireVerification: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [requireVerification, setRequireVerification] = useState(true);
  
  // Initialize auth state from Supabase session
  useEffect(() => {
    // Set up initial session and user state
    const initializeAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (data.session) {
        setSession(data.session);
        setCurrentUser(data.session.user);
        setIsEmailVerified(data.session.user?.email_confirmed_at !== null);
      }
      
      setLoading(false);
    };
    
    initializeAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (newSession) {
          setSession(newSession);
          setCurrentUser(newSession.user);
          setIsEmailVerified(newSession.user?.email_confirmed_at !== null);
          
          // Mock Instagram connection for demo purposes
          if (newSession.user) {
            const hasInstagramToken = localStorage.getItem(`instagram_token_${newSession.user.id}`);
            setInstagramConnected(!!hasInstagramToken);
          }
        } else {
          setSession(null);
          setCurrentUser(null);
          setIsEmailVerified(false);
          setInstagramConnected(false);
        }
        
        setLoading(false);
      }
    );
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Clear auth error when component unmounts or on specific actions
  const clearAuthError = () => {
    setAuthError(null);
  };

  const signUp = async (email: string, password: string, options?: { displayName?: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: options?.displayName || null
          },
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });
      
      if (error) throw error;
      
      // In Supabase, email verification is automatically sent on sign up
      return;
    } catch (error: any) {
      let errorMessage = "Failed to create account";
      
      if (error instanceof AuthError) {
        if (error.message.includes('User already registered')) {
          errorMessage = "This email is already registered. Please try logging in.";
        } else if (error.message.includes('Email')) {
          errorMessage = "Invalid email address format.";
        } else if (error.message.includes('Password')) {
          errorMessage = "Password should be at least 6 characters.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      clearAuthError();
      
      // Check if email is verified
      if (requireVerification && !data.user.email_confirmed_at) {
        setAuthError("Please verify your email address. Check your inbox for a verification link.");
      }
    } catch (error: any) {
      let errorMessage = "Failed to log in. Please check your credentials.";
      
      if (error instanceof AuthError) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Please verify your email before logging in.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      clearAuthError();
    } catch (error: any) {
      setAuthError("Failed to sign out.");
      throw error;
    }
  };
  
  const sendVerificationEmail = async () => {
    if (!currentUser?.email) {
      setAuthError("No user is currently signed in.");
      throw new Error("No user is currently signed in.");
    }
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: currentUser.email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });
      
      if (error) throw error;
      return;
    } catch (error: any) {
      const errorMessage = "Failed to send verification email. Please try again later.";
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  const confirmEmailVerification = async (token: string) => {
    try {
      // The token is usually handled automatically by Supabase through the URL
      // This function is here for compatibility with your existing code
      const { error } = await supabase.auth.getSession();
      if (error) throw error;
      return;
    } catch (error: any) {
      let errorMessage = "Failed to verify email.";
      
      if (error instanceof AuthError) {
        errorMessage = error.message;
      }
      
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      return;
    } catch (error: any) {
      let errorMessage = "Failed to send password reset email.";
      
      if (error instanceof AuthError) {
        if (error.message.includes('not found')) {
          errorMessage = "No account found with that email.";
        } else if (error.message.includes('format')) {
          errorMessage = "Invalid email address format.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  const confirmResetPassword = async (token: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) throw error;
      return;
    } catch (error: any) {
      let errorMessage = "Failed to reset password.";
      
      if (error instanceof AuthError) {
        if (error.message.includes('expired')) {
          errorMessage = "The reset link has expired or already been used.";
        } else if (error.message.includes('Password')) {
          errorMessage = "Password should be at least 6 characters.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  const updateUserProfile = async (data: { displayName?: string; avatarUrl?: string }) => {
    try {
      const updates: any = {};
      
      if (data.displayName) {
        updates.data = { ...updates.data, display_name: data.displayName };
      }
      
      const { error } = await supabase.auth.updateUser(updates);
      
      if (error) throw error;
      return;
    } catch (error: any) {
      let errorMessage = "Failed to update profile.";
      
      if (error instanceof AuthError) {
        errorMessage = error.message;
      }
      
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  const connectInstagram = async () => {
    // This would be implemented with Instagram Graph API OAuth
    // For the MVP, we'll mock it
    if (currentUser) {
      const mockToken = 'mock_instagram_token_' + Date.now();
      localStorage.setItem(`instagram_token_${currentUser.id}`, mockToken);
      setInstagramConnected(true);
    }
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    signUp,
    signIn,
    signOut,
    sendVerificationEmail,
    resetPassword,
    confirmEmailVerification,
    confirmResetPassword,
    updateUserProfile,
    instagramConnected,
    connectInstagram,
    authError,
    clearAuthError,
    isEmailVerified,
    requireVerification,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 