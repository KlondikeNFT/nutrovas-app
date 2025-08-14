import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    height: '',
    weight: '',
    sports: [] as string[],
    allergies: [] as string[],
  });

  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

  // Strava integration state
  const [stravaStatus, setStravaStatus] = useState({
    connected: false,
    expired: false,
    athleteData: null as any,
    lastSync: null as string | null
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Populate form data when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        dateOfBirth: user.dateOfBirth || '',
        height: user.height || '',
        weight: user.weight || '',
        sports: user.sports || [],
        allergies: user.allergies || [],
      });
    }
  }, [user]);

  // Check Strava connection status on component mount
  useEffect(() => {
    if (user) {
      checkStravaStatus();
    }
  }, [user]);

  const checkStravaStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('http://localhost:3001/api/auth/strava/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStravaStatus(data);
      }
    } catch (error) {
      console.error('Error checking Strava status:', error);
    }
  };

  const handleConnectStrava = async () => {
    setIsConnecting(true);
    try {
      const token = localStorage.getItem('authToken');
      console.log('Auth token:', token ? 'Found' : 'Not found');
      
      if (!token) {
        alert('No authentication token found. Please try logging out and back in.');
        setIsConnecting(false);
        return;
      }

      console.log('Making request to Strava connect endpoint...');
      const response = await fetch('http://localhost:3001/api/auth/strava/connect', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Strava auth URL received:', data.authUrl);
        
        // Open Strava OAuth in same window (to avoid popup blockers)
        window.location.href = data.authUrl;
        
        // Poll for connection status
        const checkInterval = setInterval(async () => {
          await checkStravaStatus();
          if (stravaStatus.connected) {
            clearInterval(checkInterval);
            setIsConnecting(false);
          }
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Strava connect error:', errorData);
        alert(`Error connecting to Strava: ${errorData.message}`);
        setIsConnecting(false);
      }
    } catch (error) {
      console.error('Error connecting to Strava:', error);
      alert('Network error connecting to Strava. Please try again.');
      setIsConnecting(false);
    }
  };

  const handleSyncActivities = async () => {
    setIsSyncing(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('http://localhost:3001/api/auth/strava/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Successfully synced ${data.syncedCount} activities!`);
        await checkStravaStatus();
      } else {
        const errorData = await response.json();
        alert(`Error syncing activities: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error syncing activities:', error);
      alert('Error syncing activities. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnectStrava = async () => {
    if (!window.confirm('Are you sure you want to disconnect from Strava? This will remove all connection data.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      // For now, we'll just update the local state
      // In a real app, you'd want to call an API to remove the connection
      setStravaStatus({
        connected: false,
        expired: false,
        athleteData: null,
        lastSync: null
      });
      
      alert('Disconnected from Strava successfully.');
    } catch (error) {
      console.error('Error disconnecting from Strava:', error);
      alert('Error disconnecting from Strava. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSportChange = (sport: string) => {
    setFormData(prev => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter(s => s !== sport)
        : [...prev.sports, sport]
    }));
    if (errors.sports) {
      setErrors(prev => ({ ...prev, sports: undefined }));
    }
  };

  const handleAllergyChange = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
    if (errors.allergies) {
      setErrors(prev => ({ ...prev, allergies: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string | undefined } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (formData.sports.length === 0) {
      newErrors.sports = 'Please select at least one sport';
    }

    if (formData.allergies.length === 0) {
      newErrors.allergies = 'Please select at least one option (or "None" if no allergies)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }

      const response = await fetch('http://localhost:3001/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        setIsEditing(false);
        // Refresh user data by reloading the page or calling fetchUserProfile
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-100 mb-4">Loading...</h1>
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Main Content */}
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
            
            {/* Title */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-100 mb-4">
                Your Profile
              </h1>
              <p className="text-xl text-gray-400">
                Manage your personal information and preferences
              </p>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            {!isEditing ? (
              /* View Mode */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h2 className="text-2xl font-semibold text-gray-100 mb-6">Personal Information</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                      <p className="text-lg text-gray-100">{user.firstName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                      <p className="text-lg text-gray-100">{user.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                      <p className="text-lg text-gray-100">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Age</label>
                      <p className="text-lg text-gray-100">{calculateAge(user.dateOfBirth)} years old</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Height</label>
                      <p className="text-lg text-gray-100">{user.height || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Weight</label>
                      <p className="text-lg text-gray-100">{user.weight || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Sports */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h2 className="text-2xl font-semibold text-gray-100 mb-6">Sports & Activities</h2>
                  <div className="flex flex-wrap gap-2">
                    {user.sports.map((sport) => (
                      <span
                        key={sport}
                        className="px-3 py-1 bg-blue-600 text-blue-100 rounded-full text-sm font-medium"
                      >
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h2 className="text-2xl font-semibold text-gray-100 mb-6">Allergies & Dietary Restrictions</h2>
                  <div className="flex flex-wrap gap-2">
                    {user.allergies.map((allergy) => (
                      <span
                        key={allergy}
                        className="px-3 py-1 bg-orange-600 text-orange-100 rounded-full text-sm font-medium"
                      >
                        {allergy}
                    </span>
                    ))}
                  </div>
                </div>

                {/* Fitness Platform Integration */}
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h2 className="text-2xl font-semibold text-gray-100 mb-6">Fitness Platforms</h2>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-gray-400 mb-4">Connect your fitness accounts to sync workout data</p>
                      
                      {/* Strava Integration */}
                      <div className="mb-4">
                        {stravaStatus.connected ? (
                          <div className="bg-green-600/20 border border-green-500 rounded-lg p-3 mb-3">
                            <div className="flex items-center justify-center text-green-300 mb-2">
                              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                              Connected to Strava
                            </div>
                            <p className="text-sm text-green-400 mb-3">
                              {stravaStatus.athleteData?.firstname} {stravaStatus.athleteData?.lastname}
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={handleSyncActivities}
                                disabled={isSyncing}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors disabled:opacity-50"
                              >
                                {isSyncing ? 'Syncing...' : 'Sync Activities'}
                              </button>
                              <button
                                onClick={handleDisconnectStrava}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors"
                              >
                                Disconnect
                              </button>
                            </div>
                            {stravaStatus.lastSync && (
                              <p className="text-xs text-green-500 mt-2">
                                Last synced: {new Date(stravaStatus.lastSync).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={handleConnectStrava}
                            disabled={isConnecting}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg transition-colors mb-3 flex items-center justify-center disabled:opacity-50"
                          >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M15.387 17.944c-.386.199-.386.758 0 .957l6.086 3.141c.386.199.697.199 1.083 0l6.086-3.141c-.386-.199-.386-.758 0-.957l-6.086-3.141c-.386-.199-.697-.199-1.083 0l-6.086 3.141z"/>
                            </svg>
                            {isConnecting ? 'Connecting...' : 'Connect Strava'}
                          </button>
                        )}
                      </div>
                      
                      {/* Garmin Integration */}
                      <button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center"
                        disabled
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        Connect Garmin
                      </button>
                      
                      <p className="text-xs text-gray-500 mt-3">Coming soon - Track your supplement effectiveness with workout data</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="col-span-full flex justify-center pt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-100 mb-6">Personal Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.firstName ? 'border-red-500' : ''}`}
                      />
                      {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lastName ? 'border-red-500' : ''}`}
                      />
                      {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-2">Date of Birth *</label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                      />
                      {errors.dateOfBirth && <p className="text-red-400 text-sm mt-1">{errors.dateOfBirth}</p>}
                    </div>
                    <div>
                      <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-2">Height (optional)</label>
                      <input
                        type="text"
                        id="height"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        placeholder="e.g., 5'10&quot; or 178 cm"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-2">Weight (optional)</label>
                      <input
                        type="text"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="e.g., 165 lbs or 75 kg"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <p className="text-gray-400 py-2 px-3 bg-gray-700 rounded-md border border-gray-600">
                        {user.email} <span className="text-sm text-gray-500">(cannot be changed)</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sports */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-100 mb-6">Sports & Activities *</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {['Football', 'Basketball', 'Soccer', 'Tennis', 'Swimming', 'Running', 'Weightlifting', 'Yoga', 'CrossFit', 'Cycling', 'Martial Arts', 'Other'].map((sport) => (
                      <label key={sport} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.sports.includes(sport)}
                          onChange={() => handleSportChange(sport)}
                          className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                        />
                        <span className="text-sm text-gray-300">{sport}</span>
                      </label>
                    ))}
                  </div>
                  {errors.sports && <p className="text-red-400 text-sm mt-1">{errors.sports}</p>}
                </div>

                {/* Allergies */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-100 mb-6">Allergies & Dietary Restrictions *</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    {['None', 'Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Soy', 'Wheat', 'Fish', 'Shellfish', 'Gluten', 'Lactose', 'Other'].map((allergy) => (
                      <label key={allergy} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.allergies.includes(allergy)}
                          onChange={() => handleAllergyChange(allergy)}
                          className="rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                        />
                        <span className="text-sm text-gray-300">{allergy}</span>
                      </label>
                    ))}
                  </div>
                  {errors.allergies && <p className="text-red-400 text-sm mt-1">{errors.allergies}</p>}
                  <p className="text-sm text-gray-400 mt-2">
                    Select all that apply. This helps us provide safer recommendations.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-3 text-lg border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
