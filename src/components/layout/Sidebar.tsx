import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ChartBarIcon, 
  CalendarIcon, 
  LightBulbIcon, 
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { AppRoute } from '../../types';

const routes: AppRoute[] = [
  { path: '/dashboard', label: 'Dashboard', icon: 'home' },
  { path: '/analytics', label: 'Analytics', icon: 'chart' },
  { path: '/scheduler', label: 'Post Scheduler', icon: 'calendar' },
  { path: '/content-strategy', label: 'Content Strategy', icon: 'lightbulb' },
  { path: '/settings', label: 'Settings', icon: 'settings' },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return <HomeIcon className="h-6 w-6" />;
      case 'chart':
        return <ChartBarIcon className="h-6 w-6" />;
      case 'calendar':
        return <CalendarIcon className="h-6 w-6" />;
      case 'lightbulb':
        return <LightBulbIcon className="h-6 w-6" />;
      case 'settings':
        return <Cog6ToothIcon className="h-6 w-6" />;
      default:
        return <HomeIcon className="h-6 w-6" />;
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed left-4 top-4 z-50 block md:hidden">
        <button 
          onClick={toggleMobileMenu}
          className="rounded-lg bg-white p-2 text-gray-500 shadow-lg transition-all duration-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden h-screen w-64 flex-col border-r border-gray-200 bg-white shadow-sm transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 md:flex">
        <div className="p-5">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-primary-600 dark:text-primary-400">Pal</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Your growth buddy</p>
            </div>
          </div>
        </div>

        <nav className="mt-2 flex-1 space-y-1 px-2 py-4">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={`group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                pathname === route.path
                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              <span className={`mr-3 flex-shrink-0 transition-all duration-200 ${
                pathname === route.path
                  ? 'text-primary-500 dark:text-primary-400'
                  : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
              }`}>
                {route.icon && getIcon(route.icon)}
              </span>
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <button
            onClick={handleSignOut}
            className="group flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          >
            <ArrowLeftOnRectangleIcon className="mr-3 h-6 w-6 flex-shrink-0 text-gray-500 transition-all duration-200 group-hover:text-red-500 dark:text-gray-400 dark:group-hover:text-red-400" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300" onClick={toggleMobileMenu}></div>
          <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white pt-5 shadow-xl transition-transform duration-300 dark:bg-gray-800">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-primary-600 dark:text-primary-400">Pal</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Your growth buddy</p>
                </div>
              </div>
              <button
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={toggleMobileMenu}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <nav className="mt-8 flex-1 space-y-1 px-4 py-4">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    pathname === route.path
                      ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
                  onClick={toggleMobileMenu}
                >
                  <span className={`mr-3 flex-shrink-0 transition-all duration-200 ${
                    pathname === route.path
                      ? 'text-primary-500 dark:text-primary-400'
                      : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white'
                  }`}>
                    {route.icon && getIcon(route.icon)}
                  </span>
                  {route.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-gray-200 p-4 dark:border-gray-700">
              <button
                onClick={handleSignOut}
                className="group flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              >
                <ArrowLeftOnRectangleIcon className="mr-3 h-6 w-6 flex-shrink-0 text-gray-500 transition-all duration-200 group-hover:text-red-500 dark:text-gray-400 dark:group-hover:text-red-400" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar; 