import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import baseConfig from '../../firebase-applet-config.json';

export const TARGET_PROJECT_ID = 'project-calculator-a9144';

// Check for user-provided API key from env or saved configuration
const storedApiKey = typeof window !== 'undefined' ? localStorage.getItem('firebase_custom_api_key') : null;
const rawApiKey = (
  import.meta.env.VITE_FIREBASE_API_KEY ||
  storedApiKey ||
  baseConfig.apiKey ||
  ''
).trim();

// A real Firebase Web API key is an alphanumeric string (typically starts with AIza...) of at least 20 chars
export const isValidFirebaseApiKey = (key?: string | null): boolean => {
  if (!key) return false;
  const trimmed = key.trim();
  return trimmed.length >= 15 && !trimmed.includes('MY_API_KEY') && !trimmed.includes('YOUR_');
};

export const hasConfiguredApiKey = isValidFirebaseApiKey(rawApiKey);

export const firebaseConfig = {
  apiKey: hasConfiguredApiKey ? rawApiKey : '',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    baseConfig.authDomain ||
    `${TARGET_PROJECT_ID}.firebaseapp.com`,
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    baseConfig.projectId ||
    TARGET_PROJECT_ID,
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    baseConfig.storageBucket ||
    `${TARGET_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    baseConfig.messagingSenderId ||
    '',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    baseConfig.appId ||
    '',
};

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

// Only initialize Firebase SDK when a valid API key is present, preventing auth/invalid-api-key crash
if (hasConfiguredApiKey) {
  try {
    appInstance = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
    storageInstance = getStorage(appInstance);
    console.info(`[Firebase] Successfully connected to project: ${firebaseConfig.projectId}`);
  } catch (err) {
    console.warn('[Firebase] Initialization error with provided API key:', err);
    authInstance = null;
    dbInstance = null;
    storageInstance = null;
    appInstance = null;
  }
} else {
  console.info(`[Firebase] Project target is ${TARGET_PROJECT_ID}. API key pending configuration. Local session storage fallback active.`);
}

export const app = appInstance;
export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;

export const currentFirebaseProjectId = firebaseConfig.projectId;

// Save user-provided API key to localStorage to enable immediate live connection without server restarts
export function setCustomFirebaseApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem('firebase_custom_api_key', key.trim());
    } else {
      localStorage.removeItem('firebase_custom_api_key');
    }
    window.location.reload();
  }
}

// Validate connection to Firestore as recommended in SKILL.md
export async function testConnection(): Promise<boolean> {
  if (!dbInstance) return false;
  try {
    await getDocFromServer(doc(dbInstance, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection test: client is offline or network restricted.');
    }
    return false;
  }
}

export default appInstance;
