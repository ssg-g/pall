import { Navigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 dark:from-gray-900 dark:to-gray-800">
      {/* Background decorative elements */}
      <div className="absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-secondary-300/20 blur-3xl filter dark:bg-secondary-900/20"></div>
        <div className="absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-primary-300/20 blur-3xl filter dark:bg-primary-900/20"></div>
        <div className="absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300/10 blur-3xl filter dark:bg-yellow-900/10"></div>
      </div>
      
      <div className="w-full max-w-6xl">
        <div className="flex flex-col items-center justify-center lg:flex-row-reverse lg:items-stretch">
          {/* Brand section */}
          <div className="mb-8 w-full max-w-md px-4 text-center lg:mb-0 lg:flex lg:max-w-lg lg:flex-col lg:justify-center lg:px-12 lg:text-left">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg lg:h-16 lg:w-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 lg:h-8 lg:w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <h1 className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl lg:text-6xl">Pal</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 lg:text-xl">Your growth buddy for the influencer journey</p>
            
            <div className="mt-8 hidden space-y-4 lg:block">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">Track your growth with detailed analytics</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">Get AI-powered content suggestions</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">Schedule posts at optimal times</p>
              </div>
            </div>
          </div>
          
          {/* Register form */}
          <div className="w-full max-w-md">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 