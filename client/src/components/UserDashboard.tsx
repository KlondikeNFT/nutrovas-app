import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LogIntakeForm {
  supplementName: string;
  brandName: string;
  dosage: string;
  unit: string;
  takenAt: string;
  notes: string;
}

const UserDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showLogForm, setShowLogForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [logForm, setLogForm] = useState<LogIntakeForm>({
    supplementName: '',
    brandName: '',
    dosage: '',
    unit: '',
    takenAt: new Date().toISOString().slice(0, 16),
    notes: ''
  });

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      setShowSuggestions(false);
      // TODO: Implement AI chat functionality
      console.log('Chat message:', chatInput);
      setChatInput('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setChatInput(suggestion);
    setShowSuggestions(false);
    // TODO: Implement AI chat functionality
    console.log('Suggestion clicked:', suggestion);
  };

  const handleLogIntakeClick = () => {
    setShowLogForm(true);
  };

  const handleLogFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/supplement-tracking/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          supplementName: logForm.supplementName,
          brandName: logForm.brandName,
          dosage: logForm.dosage,
          unit: logForm.unit,
          takenAt: logForm.takenAt,
          notes: logForm.notes
        })
      });

      if (response.ok) {
        setShowLogForm(false);
        setLogForm({
          supplementName: '',
          brandName: '',
          dosage: '',
          unit: '',
          takenAt: '',
          notes: ''
        });
        // TODO: Show success message or update dashboard stats
      } else {
        console.error('Failed to log intake');
      }
    } catch (error) {
      console.error('Error logging intake:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLogForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Close menu when clicking outside
  const handleClickOutside = (e: React.MouseEvent) => {
    if (showMenu && !(e.target as Element).closest('.menu-container')) {
      setShowMenu(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-100 mb-4">Loading...</h1>
          <p className="text-gray-400">Setting up your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col" onClick={handleClickOutside}>
      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          {/* Left side - Welcome */}
          <div className="flex items-center">
            <h1 className="text-lg font-medium text-gray-200">
              Welcome, {user?.firstName || user?.username || 'User'}
            </h1>
          </div>
          
          {/* Center - Brand Name */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-xl font-bold text-gray-100">SupplementAdvisor</span>
          </div>
          
          {/* Right side - Hamburger Menu */}
          <div className="relative menu-container">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-200 p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                {/* User Info Card */}
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-100">
                        {user?.firstName || user?.username || 'User'}
                      </h3>
                      <p className="text-sm text-gray-400">{user?.email}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {/* Premium Status */}
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-600 text-gray-300">
                        Free
                      </span>
                      {/* TODO: Add premium check logic */}
                      {/* {user?.isPremium && (
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      )} */}
                    </div>
                  </div>
                </div>

                {/* Menu Options */}
                <div className="py-2">
                  <Link
                    to="/profile"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate('/help');
                    }}
                    className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Help & Support
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // TODO: Implement logout
                      localStorage.removeItem('authToken');
                      window.location.href = '/';
                    }}
                    className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Menu Cards */}
      <div className="px-6 py-6 flex-shrink-0">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 min-w-max">
            {/* Supplements Card */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex-shrink-0 w-64 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-200 font-medium">Supplements</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-blue-400 text-left">0</div>
            </div>

            {/* Log New Intake Card */}
            <button 
              onClick={handleLogIntakeClick}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-700 transition-colors flex-shrink-0 w-64 text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-200 font-medium">Log new intake</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-green-400">0</div>
            </button>

            {/* My Pantry Card */}
            <Link to="/pantry" className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-700 transition-colors flex-shrink-0 w-64 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-200 font-medium">My pantry</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-purple-400 text-left">0</div>
            </Link>

            {/* Calendar Card */}
            <Link to="/tracker" className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-700 transition-colors flex-shrink-0 w-64 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-200 font-medium">Calendar</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-orange-400 text-left">📅</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Chat Area - Takes remaining space */}
      <div className="flex-1 px-6 py-4 relative">
        <div className="bg-gray-800 border border-gray-700 rounded-lg h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">Start a conversation with your AI supplement advisor</p>
          </div>
        </div>

        {/* AI Chat Suggestions - Overlay on chat area */}
        {showSuggestions && (
          <div className="absolute bottom-20 left-6 right-6">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-3 min-w-max">
                <button
                  onClick={() => handleSuggestionClick("Help me find a new supplement")}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-3 hover:bg-gray-700 transition-colors text-left shadow-lg flex-shrink-0 w-48"
                >
                  <div className="font-semibold text-gray-200 mb-1 text-sm">Help me</div>
                  <div className="text-xs text-gray-400">Find a new supplement</div>
                </button>

                <button
                  onClick={() => handleSuggestionClick("What can I take with an allergy")}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-3 hover:bg-gray-700 transition-colors text-left shadow-lg flex-shrink-0 w-48"
                >
                  <div className="font-semibold text-gray-200 mb-1 text-sm">What can I</div>
                  <div className="text-xs text-gray-400">Take with an allergy</div>
                </button>

                <button
                  onClick={() => handleSuggestionClick("Have my stats improved since starting")}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-3 hover:bg-gray-700 transition-colors text-left shadow-lg flex-shrink-0 w-48"
                >
                  <div className="font-semibold text-gray-200 mb-1 text-sm">Have my</div>
                  <div className="text-xs text-gray-400">Stats improved since starting</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Input - Overlay at bottom of chat area */}
        <div className="absolute bottom-4 left-6 right-6">
          <form onSubmit={handleChatSubmit} className="flex space-x-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Log Intake Modal */}
      {showLogForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-100">Log New Supplement Intake</h2>
              <button
                onClick={() => setShowLogForm(false)}
                className="text-gray-400 hover:text-gray-200 p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleLogFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="supplementName" className="block text-sm font-medium text-gray-300 mb-2">
                  Supplement Name *
                </label>
                <input
                  type="text"
                  id="supplementName"
                  name="supplementName"
                  value={logForm.supplementName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Vitamin D3"
                />
              </div>

              <div>
                <label htmlFor="brandName" className="block text-sm font-medium text-gray-300 mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  id="brandName"
                  name="brandName"
                  value={logForm.brandName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Nature Made"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dosage" className="block text-sm font-medium text-gray-300 mb-2">
                    Dosage *
                  </label>
                  <input
                    type="number"
                    id="dosage"
                    name="dosage"
                    value={logForm.dosage}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.1"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1000"
                  />
                </div>

                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-300 mb-2">
                    Unit *
                  </label>
                  <select
                    id="unit"
                    name="unit"
                    value={logForm.unit}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select unit</option>
                    <option value="mg">mg</option>
                    <option value="mcg">mcg</option>
                    <option value="g">g</option>
                    <option value="IU">IU</option>
                    <option value="capsule">Capsule</option>
                    <option value="tablet">Tablet</option>
                    <option value="serving">Serving</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="takenAt" className="block text-sm font-medium text-gray-300 mb-2">
                  When Taken *
                </label>
                <input
                  type="datetime-local"
                  id="takenAt"
                  name="takenAt"
                  value={logForm.takenAt}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={logForm.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Any additional notes about this intake..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowLogForm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Log Intake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
