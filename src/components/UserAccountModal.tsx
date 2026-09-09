import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User as UserIcon,
  HardDrive,
  Calculator,
  ShieldCheck,
  UploadCloud,
  FileText,
  Trash2,
  Eye,
  Download,
  AlertCircle,
  Loader2,
  Calendar,
  LogOut,
  FolderOpen,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  uploadUserFile,
  subscribeToUserFiles,
  deleteUserFile,
  subscribeToSavedCalculations,
  deleteUserCalculation,
} from '../services/firebaseDataService';
import { UserUploadedFile, SavedCalculationRecord } from '../types';
import { FilePreviewModal } from './FilePreviewModal';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadCalculation?: (record: SavedCalculationRecord) => void;
  initialTab?: 'account' | 'files' | 'calculations' | 'rules';
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  onLoadCalculation,
  initialTab = 'account',
}) => {
  const { currentUser, logoutUser, projectId } = useAuth();
  const [activeTab, setActiveTab] = useState<'account' | 'files' | 'calculations' | 'rules'>(initialTab);

  // Files state
  const [files, setFiles] = useState<UserUploadedFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [fileDescription, setFileDescription] = useState('');
  const [previewFile, setPreviewFile] = useState<UserUploadedFile | null>(null);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

  // Calculations state
  const [savedCalcs, setSavedCalcs] = useState<SavedCalculationRecord[]>([]);
  const [loadingCalcs, setLoadingCalcs] = useState(false);
  const [deletingCalcId, setDeletingCalcId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Subscribe to files and calculations when user is authenticated
  useEffect(() => {
    if (!isOpen || !currentUser?.uid) return;

    setLoadingFiles(true);
    const unsubFiles = subscribeToUserFiles(
      currentUser.uid,
      (fetchedFiles) => {
        setFiles(fetchedFiles);
        setLoadingFiles(false);
      },
      (err) => {
        console.warn('Files subscription error:', err);
        setLoadingFiles(false);
      }
    );

    setLoadingCalcs(true);
    const unsubCalcs = subscribeToSavedCalculations(
      currentUser.uid,
      (fetchedCalcs) => {
        setSavedCalcs(fetchedCalcs);
        setLoadingCalcs(false);
      },
      (err) => {
        console.warn('Calculations subscription error:', err);
        setLoadingCalcs(false);
      }
    );

    return () => {
      unsubFiles();
      unsubCalcs();
    };
  }, [isOpen, currentUser?.uid]);

  if (!isOpen) return null;

  // File Upload Handlers
  const handleFileProcess = async (file: File) => {
    if (!currentUser?.uid) return;
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      await uploadUserFile(currentUser.uid, file, fileDescription.trim());
      setUploadSuccess(`"${file.name}" uploaded and saved to your project files.`);
      setFileDescription('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to upload file.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDeleteFile = async (file: UserUploadedFile) => {
    if (!currentUser?.uid) return;
    if (!window.confirm(`Are you sure you want to delete "${file.fileName}"? This cannot be undone.`)) {
      return;
    }
    setDeletingFileId(file.id);
    try {
      await deleteUserFile(currentUser.uid, file.id, file.storagePath);
    } catch (err: any) {
      alert(`Could not delete file: ${err?.message}`);
    } finally {
      setDeletingFileId(null);
    }
  };

  const handleDeleteCalc = async (calc: SavedCalculationRecord) => {
    if (!currentUser?.uid) return;
    if (!window.confirm(`Delete calculation for "${calc.productName}"?`)) {
      return;
    }
    setDeletingCalcId(calc.id);
    try {
      await deleteUserCalculation(currentUser.uid, calc.id);
    } catch (err: any) {
      alert(`Could not delete calculation: ${err?.message}`);
    } finally {
      setDeletingCalcId(null);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="avatar"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                {currentUser?.displayName || 'User Account'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{currentUser?.email}</span>
                <span>•</span>
                <span className="text-emerald-400 font-mono text-[11px]">
                  Project: {projectId}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 sm:gap-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`py-3 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
              activeTab === 'account'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            Account Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('files')}
            className={`py-3 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
              activeTab === 'files'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            Files & Storage
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
              {files.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calculations')}
            className={`py-3 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
              activeTab === 'calculations'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            Saved Cost Sheets
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
              {savedCalcs.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`py-3 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
              activeTab === 'rules'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Security & Isolation
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {/* TAB 1: ACCOUNT DETAILS */}
          {activeTab === 'account' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-emerald-600" />
                  Firebase Account Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 font-medium block mb-1">User Identifier (UID)</span>
                    <span className="font-mono text-slate-800 font-semibold break-all select-all">
                      {currentUser?.uid}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 font-medium block mb-1">Email Address</span>
                    <span className="text-slate-800 font-semibold">{currentUser?.email}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 font-medium block mb-1">Display Name</span>
                    <span className="text-slate-800 font-semibold">{currentUser?.displayName || 'Not specified'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-slate-400 font-medium block mb-1">Email Verified</span>
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        currentUser?.emailVerified ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {currentUser?.emailVerified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                  {currentUser?.creationTime && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-slate-400 font-medium block mb-1">Account Created</span>
                      <span className="text-slate-700 font-medium">{currentUser.creationTime}</span>
                    </div>
                  )}
                  {currentUser?.lastSignInTime && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-slate-400 font-medium block mb-1">Last Sign In</span>
                      <span className="text-slate-700 font-medium">{currentUser.lastSignInTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Connected Firebase Project Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Connected Firebase Project
                    </h3>
                    <p className="text-xs text-slate-500">
                      Data and authentication are tied to your designated Firebase project:
                    </p>
                    <div className="mt-2 inline-block px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-mono text-xs font-semibold">
                      {projectId}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <span>Cloud Firestore & Authentication enabled</span>
                  <a
                    href={`https://console.firebase.google.com/project/${projectId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold"
                  >
                    Open Firebase Console <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Log Out Action */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    await logoutUser();
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition border border-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out of Account
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FILES & STORAGE */}
          {activeTab === 'files' && (
            <div className="space-y-6">
              {/* File Upload Zone */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-emerald-600" />
                  Upload Business Files & Receipts
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Upload supplier receipts, invoices, raw material specs, or product packaging images. File metadata
                  and content are stored securely for your user account in Cloud Firestore and Firebase Storage.
                </p>

                {uploadError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{uploadSuccess}</span>
                  </div>
                )}

                <div className="mb-3">
                  <input
                    type="text"
                    value={fileDescription}
                    onChange={(e) => setFileDescription(e.target.value)}
                    placeholder="Optional description / note (e.g. 'Flour supplier invoice - Aug 2026')"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                    isDragOver
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    {uploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <UploadCloud className="w-5 h-5" />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    {uploading ? 'Uploading and saving metadata...' : 'Click to browse or drag and drop a file'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supports PNG, JPG, PDF, CSV, Excel, TXT documents
                  </p>
                </div>
              </div>

              {/* Uploaded Files List */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-emerald-600" />
                    Your Uploaded Files ({files.length})
                  </h3>
                  {loadingFiles && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
                </div>

                {files.length === 0 ? (
                  <div className="text-center py-10 px-4 text-slate-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="text-xs font-medium">No files uploaded yet.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Upload your first receipt or invoice above to track your business files.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-lg transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                            {file.fileType.startsWith('image/') ? (
                              <img
                                src={file.downloadUrl || file.dataUrl}
                                alt=""
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <FileText className="w-4 h-4 text-emerald-600" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-slate-800 truncate" title={file.fileName}>
                              {file.fileName}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span>{file.uploadDate}</span>
                              <span>•</span>
                              <span>{formatSize(file.fileSize)}</span>
                              {file.description && (
                                <>
                                  <span>•</span>
                                  <span className="text-slate-600 italic truncate max-w-[180px]">
                                    {file.description}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPreviewFile(file)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition text-xs flex items-center gap-1 font-medium"
                            title="Preview File"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </button>

                          {(file.downloadUrl || file.dataUrl) && (
                            <a
                              href={file.downloadUrl || file.dataUrl}
                              download={file.fileName}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition text-xs flex items-center gap-1 font-medium"
                              title="Download File"
                            >
                              <Download className="w-4 h-4" />
                              <span className="hidden sm:inline">Download</span>
                            </a>
                          )}

                          <button
                            type="button"
                            disabled={deletingFileId === file.id}
                            onClick={() => handleDeleteFile(file)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition text-xs disabled:opacity-50"
                            title="Delete File"
                          >
                            {deletingFileId === file.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SAVED COST SHEETS */}
          {activeTab === 'calculations' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-emerald-600" />
                      Saved Product Calculations
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Costing and pricing calculations stored in Cloud Firestore under your account.
                    </p>
                  </div>
                  {loadingCalcs && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
                </div>

                {savedCalcs.length === 0 ? (
                  <div className="text-center py-10 px-4 text-slate-400">
                    <Calculator className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="text-xs font-medium">No saved calculations yet.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Use the "Save to Account" button in the calculator to store your products.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedCalcs.map((calc) => (
                      <div
                        key={calc.id}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-emerald-300 transition flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-slate-800 leading-snug">
                              {calc.productName || 'Untitled Product'}
                            </h4>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(calc.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2 bg-white rounded-lg border border-slate-100">
                              <span className="text-[10px] text-slate-400 block">True Cost / Unit</span>
                              <span className="font-semibold text-slate-700">
                                ₦{calc.trueCostPerUnit.toLocaleString()}
                              </span>
                            </div>
                            <div className="p-2 bg-emerald-50/70 rounded-lg border border-emerald-100">
                              <span className="text-[10px] text-emerald-700 block">Selling Price</span>
                              <span className="font-bold text-emerald-800">
                                ₦{calc.activeSellingPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              if (onLoadCalculation) {
                                onLoadCalculation(calc);
                                onClose();
                              }
                            }}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition"
                          >
                            Load into Calculator
                          </button>
                          <button
                            type="button"
                            disabled={deletingCalcId === calc.id}
                            onClick={() => handleDeleteCalc(calc)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete"
                          >
                            {deletingCalcId === calc.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & ISOLATION */}
          {activeTab === 'rules' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Zero-Trust Access Control & Rules
                    </h3>
                    <p className="text-xs text-slate-500">
                      Enforced directly at the Cloud Firestore database layer for {projectId}.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-600 mt-4">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block">User Identity Isolation</span>
                      Each user's files and documents reside under <code className="text-slate-800 font-mono">/users/{currentUser?.uid}/files/</code> and are only accessible by their authenticated token UID.
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block">Cross-User Tamper Prevention</span>
                      Attempts by any other user or unauthenticated request to read or delete your records will be immediately rejected with <code className="text-slate-800 font-mono">PERMISSION_DENIED</code>.
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block">Strict Field Validation & ID Guards</span>
                      All payloads enforce maximum character constraints, sanitization regexes, and immortal user identity keys.
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-3.5 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto">
                  <div className="text-emerald-400 font-semibold mb-1">// Active Firestore Rule extract:</div>
                  <pre className="text-slate-300">
{`match /users/{userId} {
  allow get, write: if isOwner(userId) && isValidId(userId);

  match /files/{fileId} {
    allow get, list, create, update, delete:
      if isOwner(userId) && isValidId(userId);
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File Preview Sub-Modal */}
      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
};
