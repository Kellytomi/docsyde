'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { auth } from './config';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Initialize Firestore
const db = getFirestore();

export interface UserProfile {
  uid: string;
  firstName?: string;
  lastName?: string;
  email: string;
  photoURL?: string;
  createdAt: Date;
  onboardingCompleted: boolean;
  jobTitle?: string;
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  isNewUser: boolean;
  setIsNewUser: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  // Fetch user profile
  const fetchUserProfile = async (user: User) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      } else {
        // Initialize user profile if it doesn't exist
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          photoURL: user.photoURL || '',
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          createdAt: new Date(),
          onboardingCompleted: false
        };
        await setDoc(doc(db, 'users', user.uid), newProfile);
        setUserProfile(newProfile);
        setIsNewUser(true);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    setIsNewUser(true);
  };

  const signInWithGoogle = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // Check if it's a new user
    const isNewAccount = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
    setIsNewUser(isNewAccount);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      // Update Firestore profile
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { ...profileData }, { merge: true });
      
      // Update Firebase Auth display name if first/last name are provided
      if (profileData.firstName || profileData.lastName) {
        const firstName = profileData.firstName || userProfile?.firstName || '';
        const lastName = profileData.lastName || userProfile?.lastName || '';
        const displayName = `${firstName} ${lastName}`.trim();
        
        if (displayName) {
          await updateProfile(user, { displayName });
        }
      }
      
      // Update photo URL if provided
      if (profileData.photoURL) {
        await updateProfile(user, { photoURL: profileData.photoURL });
      }
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...profileData } : null);
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      loading, 
      signIn, 
      signUp, 
      signInWithGoogle, 
      signOut, 
      updateUserProfile,
      isNewUser,
      setIsNewUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 