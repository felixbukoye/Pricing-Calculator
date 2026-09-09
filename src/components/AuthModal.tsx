import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Key,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const {
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    loginWithPreviewUser,
    sendPasswordReset,
    projectId,
    hasConfiguredApiKey,
    updateApiKey,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setResetSuccess(false);
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email.trim(), password);
        onClose();
      } else if (mode === 'register') {
        if (!email.trim() || !password) {
          throw new Error('Please fill in all required fields.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await registerWithEmail(email.trim(), password, name.trim());
        onClose();
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          throw new Error('Please enter your email address.');
        }
        await sendPasswordReset(email.trim());
        setResetSuccess(true);
      }
    } catch (err: any) {
      setLocalError(err?.message || 'Authentication error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    setSubmitting(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setLocalError(err?.message || 'Google Sign-in was cancelled or failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickPreviewLogin = () => {
    loginWithPreviewUser('Bukoyefelix@gmail.com', 'Felix Bukoye');
    onClose();
  };

  const handleSaveApiKey = () => {
    if (!customKeyInput.trim()) {
      setLocalError('Please enter a valid Firebase Web API key.');
      return;
    }
    updateApiKey(customKeyInput.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Top brand header */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-emerald-800 to-teal-900 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-xl bg-white/10 text-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-200">
              Firebase Project: {projectId}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-emerald-100/90 mt-0.5">
            {mode === 'login' && 'Log in to access your user-specific files, receipts, and calculation records.'}
            {mode === 'register' && 'Sign up to store user-specific documents, files, and calculations.'}
            {mode === 'forgot' && "Enter your email and we'll send a password recovery link."}
          </p>
        </div>

        <div className="p-6">
          {/* Notice about connection status */}
          {!hasConfiguredApiKey && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <div className="flex items-center gap-2 font-semibold mb-1 text-amber-900">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>Target Project: {projectId}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-700 mb-2.5">
                Firebase schema and security rules are configured. You can test all features in Preview Mode or link your Web API Key.
              </p>
              <button
                type="button"
                onClick={handleQuickPreviewLogin}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Instant Sign In as Bukoyefelix@gmail.com</span>
              </button>
            </div>
          )}

          {/* Mode Switcher */}
          {mode !== 'forgot' && (
            <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setLocalError(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                  mode === 'login'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setLocalError(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                  mode === 'register'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Quick Google Sign In */}
          {mode !== 'forgot' && (
            <div className="mb-4">
              <button
                type="button"
                disabled={submitting}
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-xl shadow-xs transition disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-slate-400">or with email</span>
                </div>
              </div>
            </div>
          )}

          {/* Alerts */}
          {localError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{localError}</span>
            </div>
          )}

          {resetSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>Password reset email sent. Please check your inbox.</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Felix Bukoye"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Bukoyefelix@gmail.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setLocalError(null);
                        setResetSuccess(false);
                      }}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' && 'Sign In'}
              {mode === 'register' && 'Create Account'}
              {mode === 'forgot' && 'Send Reset Link'}
            </button>
          </form>

          {/* Optional Direct Firebase API Key Section */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <Key className="w-3.5 h-3.5" />
                Firebase Web API Key Settings
              </span>
              {showApiKeyInput ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showApiKeyInput && (
              <div className="mt-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <p className="text-[11px] text-slate-600 mb-2">
                  Paste your Web API key from Firebase Console (Project Settings &gt; General &gt; Web API Key):
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={customKeyInput}
                    onChange={(e) => setCustomKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleSaveApiKey}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
                  >
                    Save &amp; Connect
                  </button>
                </div>
              </div>
            )}
          </div>

          {mode === 'forgot' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setLocalError(null);
                  setResetSuccess(false);
                }}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                ← Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
