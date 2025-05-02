import { useState, FormEvent, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, EnvelopeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [emailVerifiedMessage, setEmailVerifiedMessage] = useState('');
  
  const { signIn, authError, clearAuthError, resetPassword, confirmEmailVerification, isEmailVerified } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for email verification code in URL
    const params = new URLSearchParams(location.search);
    const oobCode = params.get('oobCode');
    const mode = params.get('mode');
    const verified = params.get('verified');
    
    if (verified === 'true') {
      setEmailVerifiedMessage('Your email has been verified! You can now log in.');
    }
    
    if (oobCode && mode === 'verifyEmail') {
      confirmEmailVerification(oobCode)
        .then(() => {
          setEmailVerifiedMessage('Your email has been verified successfully! You can now log in.');
        })
        .catch((error) => {
          console.error('Verification error:', error);
          setEmailVerifiedMessage('Email verification failed. The link may have expired.');
        });
    }
  }, [location, confirmEmailVerification]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearAuthError();
    
    if (!email || !password) {
      return;
    }
    
    try {
      setLoading(true);
      await signIn(email, password);
      // Navigation will be handled by the auth state change
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) return;
    
    try {
      setResetLoading(true);
      await resetPassword(forgotPasswordEmail);
      setResetSent(true);
    } catch (err) {
      console.error('Reset password error:', err);
    } finally {
      setResetLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-2xl transition-all duration-300 dark:bg-gray-800/90 dark:shadow-gray-900/30">
      {showForgotPassword ? (
        <>
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg">
              <LockClosedIcon className="h-10 w-10" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Reset Password</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter your email to receive a password reset link
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
            {authError && (
              <div className="animate-shake rounded-md bg-red-50 p-4 shadow-sm dark:bg-red-900/50">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{authError}</p>
              </div>
            )}
            
            {resetSent && (
              <div className="rounded-md bg-green-50 p-4 shadow-sm dark:bg-green-900/50">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Password reset link sent! Check your email inbox.
                </p>
              </div>
            )}
            
            <div className="space-y-5">
              <div className="space-y-1">
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="reset-email"
                    name="reset-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="input block w-full border-gray-300 px-10 py-2 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:focus:border-primary-400"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={resetLoading || !forgotPasswordEmail}
                className="btn btn-primary group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 text-sm font-medium text-white transition-all hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {resetLoading ? (
                  <span className="flex items-center">
                    <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </span>
                ) : 'Send Reset Link'}
              </button>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  clearAuthError();
                }}
                className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="mt-6 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-3xl font-extrabold text-transparent dark:from-primary-400 dark:to-secondary-400">Welcome Back!</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to continue your growth journey
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {emailVerifiedMessage && (
              <div className="rounded-md bg-green-50 p-4 shadow-sm dark:bg-green-900/50">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">{emailVerifiedMessage}</p>
              </div>
            )}
            
            {authError && (
              <div className="animate-shake rounded-md bg-red-50 p-4 shadow-sm dark:bg-red-900/50">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{authError}</p>
              </div>
            )}
            
            <div className="space-y-5">
              <div className="space-y-1">
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input block w-full border-gray-300 px-10 py-2 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:focus:border-primary-400"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input block w-full border-gray-300 px-10 py-2 pr-12 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:focus:border-primary-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setForgotPasswordEmail(email);
                    clearAuthError();
                  }}
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Forgot password?
                </button>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 text-sm font-medium text-white transition-all hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  Create one now
                </Link>
              </p>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default LoginForm; 