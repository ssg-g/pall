import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { SunIcon, MoonIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

// For MVP, we'll create a simple Switch component
// In a real app, you might use a component library
const Switch = ({ 
  checked, 
  onChange, 
  label 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void;
  label?: string;
}) => {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:bg-gray-700 dark:peer-focus:ring-primary-800"></div>
      {label && <span className="ml-3 text-sm font-medium">{label}</span>}
    </label>
  );
};

const Settings = () => {
  const { currentUser, instagramConnected, connectInstagram } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleConnectInstagram = async () => {
    setLoading(true);
    
    try {
      await connectInstagram();
    } catch (error) {
      console.error('Error connecting Instagram:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="card">
            <h2 className="mb-4 text-lg font-medium">Account Settings</h2>
            
            <div className="space-y-4">
              <div>
                <p className="label">Email</p>
                <p className="mt-1">{currentUser?.email}</p>
              </div>
              
              <div>
                <p className="label">Instagram Connection</p>
                {instagramConnected ? (
                  <div className="mt-1 flex items-center">
                    <span className="flex items-center text-green-600 dark:text-green-400">
                      <svg className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Connected as @demo_influencer
                    </span>
                    <button
                      className="ml-4 text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                      onClick={handleConnectInstagram}
                    >
                      Refresh connection
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleConnectInstagram}
                    disabled={loading}
                    className="btn btn-primary mt-1 flex items-center"
                  >
                    {loading ? (
                      <>
                        <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      'Connect Instagram Account'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Appearance Settings */}
          <div className="card">
            <h2 className="mb-4 text-lg font-medium">Appearance</h2>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {theme === 'dark' ? (
                  <MoonIcon className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" />
                ) : (
                  <SunIcon className="mr-3 h-6 w-6 text-amber-500" />
                )}
                <span>Dark Mode</span>
              </div>
              <Switch
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
            </div>
          </div>
          
          {/* Notifications Settings */}
          <div className="card">
            <h2 className="mb-4 text-lg font-medium">Notifications</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Push Notifications</span>
                <Switch
                  checked={notifications}
                  onChange={setNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span>Email Notifications</span>
                <Switch
                  checked={emailNotifications}
                  onChange={setEmailNotifications}
                />
              </div>
            </div>
          </div>
          
          {/* Data & Privacy */}
          <div className="card">
            <h2 className="mb-4 text-lg font-medium">Data & Privacy</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We only store the data necessary to provide you with our services.
                  Your Instagram data is accessed via Instagram Graph API and we follow all Meta Platform policies.
                </p>
              </div>
              
              <div>
                <button className="text-sm font-medium text-red-600 hover:text-red-500 dark:text-red-400">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings; 