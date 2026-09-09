import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, hasConfiguredApiKey, currentFirebaseProjectId, setCustomFirebaseApiKey } from '../lib/firebase';
import { UserAccountInfo } from '../types';

interface AuthContextType {
  currentUser: UserAccountInfo | null;
  firebaseUser: User | null;
  loading: boolean;
  error: string | null;
  hasConfiguredApiKey: boolean;
  projectId: string;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  loginWithPreviewUser: (email: string, displayName?: string) => void;
  logoutUser: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateApiKey: (key: string) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PREVIEW_USER_KEY = 'app_preview_authenticated_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<UserAccountInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If Firebase Auth is initialized and ready
    if (auth) {
      try {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          setFirebaseUser(user);
          if (user) {
            const userInfo: UserAccountInfo = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              photoURL: user.photoURL,
              emailVerified: user.emailVerified,
              creationTime: user.metadata.creationTime,
              lastSignInTime: user.metadata.lastSignInTime,
            };
            setCurrentUser(userInfo);

            // Sync user profile document in Firestore if db is ready
            if (db) {
              const userDocRef = doc(db, 'users', user.uid);
              try {
                const userDocSnap = await getDoc(userDocRef);
                if (!userDocSnap.exists()) {
                  await setDoc(userDocRef, {
                    userId: user.uid,
                    email: user.email || '',
                    displayName: userInfo.displayName || '',
                    photoURL: user.photoURL || '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  });
                } else {
                  await setDoc(
                    userDocRef,
                    {
                      updatedAt: new Date().toISOString(),
                      displayName: userInfo.displayName || '',
                      email: user.email || '',
                    },
                    { merge: true }
                  );
                }
              } catch (err) {
                console.warn('Could not sync user profile to Firestore:', err);
              }
            }
          } else {
            setCurrentUser(null);
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (err) {
        console.warn('Failed to attach Firebase Auth listener:', err);
        setLoading(false);
      }
    } else {
      // Local session mode: restore user from local storage if saved
      try {
        const saved = localStorage.getItem(PREVIEW_USER_KEY);
        if (saved) {
          setCurrentUser(JSON.parse(saved));
        }
      } catch (e) {
        console.warn('Could not read saved user session:', e);
      }
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    setError(null);
    if (!auth) {
      // Provide simulated login with Google profile in preview mode
      const simulated: UserAccountInfo = {
        uid: 'user-google-preview',
        email: 'Bukoyefelix@gmail.com',
        displayName: 'Bukoye Felix',
        photoURL: null,
        emailVerified: true,
        creationTime: new Date().toLocaleDateString(),
        lastSignInTime: new Date().toLocaleString(),
      };
      setCurrentUser(simulated);
      localStorage.setItem(PREVIEW_USER_KEY, JSON.stringify(simulated));
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      const msg = err?.message || 'Google Sign-in failed. Please verify popup permissions.';
      setError(msg);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setError(null);
    if (!auth) {
      // Local session sign-in
      const simulated: UserAccountInfo = {
        uid: `user-${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email: email.trim(),
        displayName: email.split('@')[0],
        photoURL: null,
        emailVerified: true,
        creationTime: new Date().toLocaleDateString(),
        lastSignInTime: new Date().toLocaleString(),
      };
      setCurrentUser(simulated);
      localStorage.setItem(PREVIEW_USER_KEY, JSON.stringify(simulated));
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      console.error('Email sign in failed:', err);
      let friendly = err?.message || 'Failed to sign in.';
      if (
        err?.code === 'auth/user-not-found' ||
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/invalid-credential'
      ) {
        friendly = 'Invalid email address or password.';
      }
      setError(friendly);
      throw new Error(friendly);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name?: string) => {
    setError(null);
    if (!auth) {
      const simulated: UserAccountInfo = {
        uid: `user-${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email: email.trim(),
        displayName: name?.trim() || email.split('@')[0],
        photoURL: null,
        emailVerified: true,
        creationTime: new Date().toLocaleDateString(),
        lastSignInTime: new Date().toLocaleString(),
      };
      setCurrentUser(simulated);
      localStorage.setItem(PREVIEW_USER_KEY, JSON.stringify(simulated));
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name && userCred.user) {
        await updateProfile(userCred.user, { displayName: name });
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      let friendly = err?.message || 'Failed to create account.';
      if (err?.code === 'auth/email-already-in-use') {
        friendly = 'An account with this email already exists.';
      } else if (err?.code === 'auth/weak-password') {
        friendly = 'Password is too weak. Please use at least 6 characters.';
      }
      setError(friendly);
      throw new Error(friendly);
    }
  };

  const loginWithPreviewUser = (email: string, displayName?: string) => {
    const userObj: UserAccountInfo = {
      uid: `user-${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email: email.trim(),
      displayName: displayName || email.split('@')[0],
      photoURL: null,
      emailVerified: true,
      creationTime: new Date().toLocaleDateString(),
      lastSignInTime: new Date().toLocaleString(),
    };
    setCurrentUser(userObj);
    localStorage.setItem(PREVIEW_USER_KEY, JSON.stringify(userObj));
  };

  const logoutUser = async () => {
    setError(null);
    try {
      if (auth) {
        await signOut(auth);
      }
      setCurrentUser(null);
      setFirebaseUser(null);
      localStorage.removeItem(PREVIEW_USER_KEY);
    } catch (err: any) {
      setError(err?.message || 'Failed to log out.');
    }
  };

  const sendPasswordReset = async (email: string) => {
    setError(null);
    if (!auth) {
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset link.');
      throw err;
    }
  };

  const updateApiKey = (key: string) => {
    setCustomFirebaseApiKey(key);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        loading,
        error,
        hasConfiguredApiKey,
        projectId: currentFirebaseProjectId,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        loginWithPreviewUser,
        logoutUser,
        sendPasswordReset,
        updateApiKey,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
