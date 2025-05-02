import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { currentUser, instagramConnected } = useAuth();
  
  if (!currentUser) {
    return null; // Auth guard will handle redirection
  }
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 md:px-6">
          <div>
            {!instagramConnected && (
              <div className="flex items-center space-x-2 rounded-full bg-yellow-50 px-4 py-2 dark:bg-yellow-900/30">
                <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-400"></span>
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Instagram not connected. Please connect your account in Settings.
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex items-center space-x-3">
              <div className="hidden text-right md:block">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {currentUser.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Influencer</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md transition-transform duration-200 hover:scale-105">
                {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : '?'}
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 