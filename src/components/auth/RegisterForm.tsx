import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const { signUp, authError, clearAuthError } = useAuth();
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearAuthError();
    
    if (!email || !password || !confirmPassword) {
      return;
    }
    
    if (password !== confirmPassword) {
      return;
    }
    
    if (password.length < 6) {
      return;
    }
    
    try {
      setLoading(true);
      await signUp(email, password, displayName || undefined);
      setRegistrationSuccess(true);
      // Navigation will be handled by the auth state change
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  if (registrationSuccess) {
    return (
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-2xl transition-all duration-300 dark:bg-gray-800/90 dark:shadow-gray-900/30">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-lg dark:bg-green-900/30 dark:text-green-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Verification Email Sent!</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Please check your email inbox at <span className="font-medium text-primary-600 dark:text-primary-400">{email}</span> and click the verification link to activate your account.
          </p>
        </div>
        
        <div className="mt-6 rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                You can now proceed to sign in. After verification, you'll have full access to all features.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center rounded-md bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50"
          >
            Go to Sign In
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-2xl transition-all duration-300 dark:bg-gray-800/90 dark:shadow-gray-900/30">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
        </div>
        <h2 className="mt-6 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-3xl font-extrabold text-transparent dark:from-primary-400 dark:to-secondary-400">Create Your Account</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Start your journey to growth today
        </p>
      </div>
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {authError && (
          <div className="animate-shake rounded-md bg-red-50 p-4 shadow-sm dark:bg-red-900/50">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">{authError}</p>
          </div>
        )}
        
        <div className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="display-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Name (optional)
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="display-name"
                name="display-name"
                type="text"
                autoComplete="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input block w-full border-gray-300 px-10 py-2 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:focus:border-primary-400"
                placeholder="John Doe"
              />
            </div>
          </div>
          
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
                autoComplete="new-password"
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
            {password && password.length < 6 && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">Password must be at least 6 characters</p>
            )}
          </div>
          
          <div className="space-y-1">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input block w-full border-gray-300 px-10 py-2 pr-12 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:focus:border-primary-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {password && confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">Passwords do not match</p>
            )}
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading || !email || !password || !confirmPassword || password !== confirmPassword || password.length < 6}
            className="btn btn-primary group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 text-sm font-medium text-white transition-all hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : 'Create account'}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              Sign in instead
            </Link>
          </p>
        </div>
        
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </div>
      </form>
    </div>
  );
};

export default RegisterForm; 