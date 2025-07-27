import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { 
  signIn, 
  logOut, 
  onAuthStateChange, 
  resetPassword, 
  sendVerificationEmail, 
  updateUserProfile, 
  isUserVerified 
} from '../firebase/auth';

interface AuthContextType {
  user: FirebaseUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  sendVerificationEmail: () => Promise<boolean>;
  updateProfile: (displayName: string, photoURL?: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isVerified: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signIn(email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };



  const logout = async (): Promise<void> => {
    try {
      await logOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await resetPassword(email);
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    }
  };

  const sendVerificationEmail = async (): Promise<boolean> => {
    try {
      await sendVerificationEmail();
      return true;
    } catch (error) {
      console.error('Send verification email error:', error);
      return false;
    }
  };

  const updateProfile = async (displayName: string, photoURL?: string): Promise<boolean> => {
    try {
      await updateUserProfile(displayName, photoURL);
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      resetPassword, 
      sendVerificationEmail, 
      updateProfile, 
      isAuthenticated, 
      isVerified: isUserVerified(),
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};