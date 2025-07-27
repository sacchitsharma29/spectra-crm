import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  User,
  UserCredential 
} from 'firebase/auth';
import { auth } from './config';

// Sign up with email and password
export const signUp = async (email: string, password: string, displayName?: string): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name if provided
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }
    
    // Send email verification
    if (userCredential.user) {
      await sendEmailVerification(userCredential.user);
    }
    
    return userCredential;
  } catch (error) {
    throw error;
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
};

// Sign out
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

// Send email verification
export const sendVerificationEmail = async (): Promise<void> => {
  try {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  } catch (error) {
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (displayName: string, photoURL?: string): Promise<void> => {
  try {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL
      });
    }
  } catch (error) {
    throw error;
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Check if user is verified
export const isUserVerified = (): boolean => {
  return auth.currentUser?.emailVerified || false;
}; 