import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        {theme === 'dark' ? (
          <SunIcon className="absolute inset-0 h-full w-full rotate-90 transform p-2 text-yellow-400 transition-all duration-500 ease-in-out dark:rotate-0" />
        ) : (
          <MoonIcon className="absolute inset-0 h-full w-full -rotate-90 transform p-2 text-gray-700 transition-all duration-500 ease-in-out dark:rotate-0" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle; 