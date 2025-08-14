import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface Settings {
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
  privacy: {
    shareData: boolean;
    analytics: boolean;
  };
  display: {
    compactMode: boolean;
    showWorkoutData: boolean;
  };
}

const Settings: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<Settings>({
    theme: theme,
    notifications: {
      email: true,
      push: false,
      reminders: true,
    },
    privacy: {
      shareData: false,
      analytics: true,
    },
    display: {
      compactMode: false,
      showWorkoutData: true,
    },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const handleSettingChange = (category: keyof Settings, key: string, value: any) => {
    if (category === 'theme' && key === 'theme') {
      setTheme(value);
    }
    
    setSettings(prev => {
      const currentCategory = prev[category];
      if (typeof currentCategory === 'object' && currentCategory !== null) {
        return {
          ...prev,
          [category]: {
            ...currentCategory,
            [key]: value,
          },
        };
      }
      return prev;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // Here you could also save to backend if needed
      // await fetch('/api/settings', { method: 'PUT', body: JSON.stringify(settings) });
      
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error saving settings. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    const defaultSettings: Settings = {
      theme: 'dark',
      notifications: {
        email: true,
        push: false,
        reminders: true,
      },
      privacy: {
        shareData: false,
        analytics: true,
      },
      display: {
        compactMode: false,
        showWorkoutData: true,
      },
    };
    setSettings(defaultSettings);
    setTheme('dark');
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-100 mb-4">Loading...</h1>
          <p className="text-gray-400">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container-responsive py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            {/* Back Button */}
            <div className="mb-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-100 mb-4">
                Settings
              </h1>
              <p className="text-xl text-gray-400">
                Customize your SupplementAdvisor experience
              </p>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-8">
            {/* Theme Settings */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">Appearance</h2>
                  <p className="text-gray-400">Customize how SupplementAdvisor looks and feels</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">Theme</h3>
                    <p className="text-gray-400">Choose between light and dark mode</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleSettingChange('theme', 'theme', 'light')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        settings.theme === 'light'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => handleSettingChange('theme', 'theme', 'dark')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        settings.theme === 'dark'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">Compact Mode</h3>
                    <p className="text-gray-400">Reduce spacing for more content on screen</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('display', 'compactMode', !settings.display.compactMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.display.compactMode ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.display.compactMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">Notifications</h2>
                  <p className="text-gray-400">Control how and when you receive updates</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">Email Notifications</h3>
                    <p className="text-gray-400">Receive updates and reminders via email</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('notifications', 'email', !settings.notifications.email)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications.email ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">Push Notifications</h3>
                    <p className="text-gray-400">Get real-time updates on your device</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('notifications', 'push', !settings.notifications.push)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications.push ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.push ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">Supplement Reminders</h3>
                    <p className="text-gray-400">Get reminded to take your supplements</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('notifications', 'reminders', !settings.notifications.reminders)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications.reminders ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.reminders ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">Privacy & Data</h2>
                  <p className="text-gray-400">Control how your data is used and shared</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">Share Data for Research</h3>
                    <p className="text-gray-400">Help improve supplement recommendations (anonymized)</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('privacy', 'shareData', !settings.privacy.shareData)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.privacy.shareData ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.privacy.shareData ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">Analytics</h3>
                    <p className="text-gray-400">Help us improve the app with usage analytics</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('privacy', 'analytics', !settings.privacy.analytics)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.privacy.analytics ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.privacy.analytics ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">Display Options</h2>
                  <p className="text-gray-400">Customize what you see in the app</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">Show Workout Data</h3>
                    <p className="text-gray-400">Display workout information in calendar view</p>
                  </div>
                  <button
                    onClick={() => handleSettingChange('display', 'showWorkoutData', !settings.display.showWorkoutData)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.display.showWorkoutData ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.display.showWorkoutData ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Legal & Terms */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-100">Legal & Terms</h2>
                <p className="text-gray-400">Important legal information and policies</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">Terms of Service & Privacy Policy</h3>
                    <p className="text-gray-400">Read our terms of service and privacy policy</p>
                  </div>
                  <button
                    onClick={() => window.open('/terms', '_self')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    View Terms
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">Data Export</h3>
                    <p className="text-gray-400">Download a copy of your personal data</p>
                  </div>
                  <button
                    onClick={() => {
                      // TODO: Implement data export functionality
                      alert('Data export feature coming soon!');
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-gray-100 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Export Data
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">Account Deletion</h3>
                    <p className="text-gray-400">Permanently delete your account and all data</p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.')) {
                        // TODO: Implement account deletion
                        alert('Account deletion feature coming soon!');
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center justify-center"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
            
            <button
              onClick={resetToDefaults}
              className="bg-gray-600 hover:bg-gray-700 text-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Reset to Defaults
            </button>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <div className="mt-4 text-center">
              <div className={`inline-block px-4 py-2 rounded-lg ${
                saveMessage.includes('Error') 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {saveMessage}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
