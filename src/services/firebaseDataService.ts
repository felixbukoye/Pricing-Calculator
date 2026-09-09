import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage, auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';
import { UserUploadedFile, SavedCalculationRecord } from '../types';

// Helper to convert File to base64 Data URL for preview and resilient offline/storage fallback
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Local storage fallback keys
const getFilesStorageKey = (userId: string) => `local_fb_files_${userId}`;
const getCalcsStorageKey = (userId: string) => `local_fb_calcs_${userId}`;

function getLocalFiles(userId: string): UserUploadedFile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(getFilesStorageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalFiles(userId: string, files: UserUploadedFile[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getFilesStorageKey(userId), JSON.stringify(files));
    window.dispatchEvent(new CustomEvent(`fb_files_update_${userId}`, { detail: files }));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
}

function getLocalCalcs(userId: string): SavedCalculationRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(getCalcsStorageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalCalcs(userId: string, calcs: SavedCalculationRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getCalcsStorageKey(userId), JSON.stringify(calcs));
    window.dispatchEvent(new CustomEvent(`fb_calcs_update_${userId}`, { detail: calcs }));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
}

/**
 * Uploads a file, saves metadata to Firestore at `users/{userId}/files/{fileId}`,
 * and uploads to Firebase Storage when available.
 */
export async function uploadUserFile(
  userId: string,
  file: File,
  description?: string
): Promise<UserUploadedFile> {
  const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const filePath = `users/${userId}/files/${fileId}`;
  const uploadDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let storagePath: string | undefined;
  let downloadUrl: string | undefined;
  let dataUrl: string | undefined;

  // Read dataUrl for preview (limit to 2MB)
  if (file.size <= 2097152) {
    try {
      dataUrl = await readFileAsDataURL(file);
    } catch (e) {
      console.warn('Could not read file as dataUrl:', e);
    }
  }

  // Attempt Firebase Storage upload if available
  if (storage) {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      storagePath = `users/${userId}/files/${fileId}_${sanitizedName}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      downloadUrl = await getDownloadURL(storageRef);
    } catch (storageErr) {
      console.warn('Firebase Storage upload bypassed or failed, using Firestore file record:', storageErr);
    }
  }

  const fileRecord: UserUploadedFile = {
    id: fileId,
    userId,
    fileName: file.name,
    fileType: file.type || 'application/octet-stream',
    fileSize: file.size,
    storagePath,
    downloadUrl,
    dataUrl,
    uploadDate,
    description: description || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // If live Firestore is available, save to Firestore
  if (db) {
    try {
      const docRef = doc(db, 'users', userId, 'files', fileId);
      await setDoc(docRef, fileRecord);
      return fileRecord;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, filePath, auth);
    }
  } else {
    // Local fallback persistence
    const existing = getLocalFiles(userId);
    setLocalFiles(userId, [fileRecord, ...existing]);
    return fileRecord;
  }
}

/**
 * Real-time subscription to a user's uploaded files collection
 */
export function subscribeToUserFiles(
  userId: string,
  onFiles: (files: UserUploadedFile[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  if (db) {
    const filesPath = `users/${userId}/files`;
    const filesColRef = collection(db, 'users', userId, 'files');
    const q = query(filesColRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const files: UserUploadedFile[] = [];
        snapshot.forEach((docSnap) => {
          files.push(docSnap.data() as UserUploadedFile);
        });
        onFiles(files);
      },
      (error) => {
        console.error('Files listener error:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, filesPath, auth);
      }
    );
  }

  // Local fallback subscription
  onFiles(getLocalFiles(userId));

  const handleUpdate = (e: Event) => {
    const customEvent = e as CustomEvent<UserUploadedFile[]>;
    onFiles(customEvent.detail || getLocalFiles(userId));
  };

  const eventName = `fb_files_update_${userId}`;
  window.addEventListener(eventName, handleUpdate);

  return () => {
    window.removeEventListener(eventName, handleUpdate);
  };
}

/**
 * Deletes a file document and corresponding storage object
 */
export async function deleteUserFile(
  userId: string,
  fileId: string,
  storagePath?: string
): Promise<void> {
  const filePath = `users/${userId}/files/${fileId}`;

  // Attempt to delete storage object if exists
  if (storage && storagePath) {
    try {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
    } catch (e) {
      console.warn('Firebase Storage delete warning:', e);
    }
  }

  if (db) {
    try {
      const docRef = doc(db, 'users', userId, 'files', fileId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, filePath, auth);
    }
  } else {
    const current = getLocalFiles(userId);
    setLocalFiles(userId, current.filter((f) => f.id !== fileId));
  }
}

/**
 * Saves calculation data to Firestore for the user
 */
export async function saveUserCalculation(
  userId: string,
  calc: {
    productName: string;
    batchUnits: number;
    trueCostPerUnit: number;
    activeSellingPrice: number;
    payloadJson: string;
  }
): Promise<SavedCalculationRecord> {
  const calcId = `calc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const calcPath = `users/${userId}/calculations/${calcId}`;

  const record: SavedCalculationRecord = {
    id: calcId,
    userId,
    productName: calc.productName,
    batchUnits: calc.batchUnits,
    trueCostPerUnit: calc.trueCostPerUnit,
    activeSellingPrice: calc.activeSellingPrice,
    payloadJson: calc.payloadJson,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (db) {
    try {
      const docRef = doc(db, 'users', userId, 'calculations', calcId);
      await setDoc(docRef, record);
      return record;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, calcPath, auth);
    }
  } else {
    const existing = getLocalCalcs(userId);
    setLocalCalcs(userId, [record, ...existing]);
    return record;
  }
}

/**
 * Real-time subscription to saved calculations
 */
export function subscribeToSavedCalculations(
  userId: string,
  onCalcs: (calcs: SavedCalculationRecord[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  if (db) {
    const calcsPath = `users/${userId}/calculations`;
    const colRef = collection(db, 'users', userId, 'calculations');
    const q = query(colRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const records: SavedCalculationRecord[] = [];
        snapshot.forEach((docSnap) => {
          records.push(docSnap.data() as SavedCalculationRecord);
        });
        onCalcs(records);
      },
      (error) => {
        console.error('Calculations listener error:', error);
        if (onError) onError(error);
        handleFirestoreError(error, OperationType.GET, calcsPath, auth);
      }
    );
  }

  // Local fallback subscription
  onCalcs(getLocalCalcs(userId));

  const handleUpdate = (e: Event) => {
    const customEvent = e as CustomEvent<SavedCalculationRecord[]>;
    onCalcs(customEvent.detail || getLocalCalcs(userId));
  };

  const eventName = `fb_calcs_update_${userId}`;
  window.addEventListener(eventName, handleUpdate);

  return () => {
    window.removeEventListener(eventName, handleUpdate);
  };
}

/**
 * Deletes a saved calculation
 */
export async function deleteUserCalculation(
  userId: string,
  calcId: string
): Promise<void> {
  const calcPath = `users/${userId}/calculations/${calcId}`;
  if (db) {
    try {
      const docRef = doc(db, 'users', userId, 'calculations', calcId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, calcPath, auth);
    }
  } else {
    const current = getLocalCalcs(userId);
    setLocalCalcs(userId, current.filter((c) => c.id !== calcId));
  }
}
