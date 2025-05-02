import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const VerifyEmail = () => {
  const [verifying, setVerifying] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmEmailVerification } = useAuth();
  
  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const oobCode = params.get('oobCode');
      
      if (!oobCode) {
        setError('Invalid verification link. No verification code found.');
        setVerifying(false);
        return;
      }
      
      try {
        await confirmEmailVerification(oobCode);
        setVerificationSuccess(true);
        setVerifying(false);
      } catch (err: any) {
        console.error('Verification error:', err);
        setError(err.message || 'Failed to verify email. The link may have expired.');
        setVerifying(false);
      }
    };
    
    verifyEmail();
  }, [location, confirmEmailVerification]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-2xl transition-all duration-300 dark:bg-gray-800/90 dark:shadow-gray-900/30">
        {verifying ? (
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 dark:border-primary-900 dark:border-t-primary-400"></div>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">Verifying your email...</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Please wait while we verify your email address.</p>
          </div>
        ) : verificationSuccess ? (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-lg dark:bg-green-900/30 dark:text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Email Verified!</h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Your email has been successfully verified. You now have full access to all features.
            </p>
            
            <div className="mt-8">
              <Link
                to="/login"
                className="btn btn-primary inline-flex items-center rounded-md px-4 py-2 text-sm font-medium"
              >
                Go to Sign In
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-lg dark:bg-red-900/30 dark:text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Verification Failed</h2>
            <p className="mt-2 text-center text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
            
            <div className="mt-8 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You can try the following:
              </p>
              <ul className="ml-4 list-disc text-left text-sm text-gray-600 dark:text-gray-400">
                <li>Check if you've already verified your email</li>
                <li>Request a new verification email from your profile</li>
                <li>Make sure you're using the most recent verification link</li>
              </ul>
              
              <div className="pt-4">
                <Link
                  to="/login"
                  className="btn-outline inline-flex items-center rounded-md px-4 py-2 text-sm font-medium"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail; 