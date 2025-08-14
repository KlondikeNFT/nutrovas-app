import React, { useState, useEffect } from 'react';

interface SupplementTrackingEntry {
  id: number;
  supplementId: number;
  supplementName: string;
  brandName?: string;
  dosage: string;
  unit: string;
  takenAt: string;
  notes?: string;
  source: string;
}

interface PantryItem {
  id: number;
  productId: number;
  productName: string;
  brandName?: string;
  upcSku?: string;
  servingSize?: string;
  quantity: number;
  addedAt: string;
  source?: 'pantry' | 'custom';
}

interface DayCard {
  date: Date;
  supplementEntries: SupplementTrackingEntry[];
  hasWorkoutData: boolean;
  workoutType?: string;
  workoutDuration?: string;
  workoutDistance?: string;
  workoutCalories?: number;
}

const SupplementTracker: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [trackingData, setTrackingData] = useState<SupplementTrackingEntry[]>([]);
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [showLogForm, setShowLogForm] = useState(false);

  const [logForm, setLogForm] = useState({
    supplementId: '',
    supplementName: '',
    brandName: '',
    dosage: '',
    unit: '',
    takenAt: '',
    notes: '',
    source: 'pantry'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  useEffect(() => {
    loadTrackingData();
    loadPantryItems();
  }, []);

  const loadTrackingData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/supplement-tracking', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTrackingData(data.tracking);
      }
    } catch (error) {
      console.error('Error loading tracking data:', error);
    }
  };

  const loadPantryItems = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/pantry', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPantryItems(data.pantry);
      }
    } catch (error) {
      console.error('Error loading pantry items:', error);
    }
  };

  const handleDateClick = (date: Date) => {
    setShowLogForm(true);
    setLogForm(prev => ({
      ...prev,
      takenAt: date.toISOString().slice(0, 16)
    }));
  };

  const handlePantryItemSelect = (item: PantryItem) => {
    setLogForm(prev => ({
      ...prev,
      supplementId: item.productId.toString(),
      supplementName: item.productName,
      brandName: item.brandName || '',
      source: item.source || 'pantry'
    }));
  };

  const handleLogSupplement = async () => {
    if (!logForm.supplementName || !logForm.dosage || !logForm.unit || !logForm.takenAt) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/supplement-tracking/log', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...logForm,
          supplementId: parseInt(logForm.supplementId) || null,
          source: logForm.source || 'pantry'
        }),
      });

      if (response.ok) {
        await loadTrackingData();
        setShowLogForm(false);
        setLogForm({
          supplementId: '',
          supplementName: '',
          brandName: '',
          dosage: '',
          unit: '',
          takenAt: '',
          notes: '',
          source: 'pantry'
        });
        alert('Supplement intake logged successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to log supplement intake');
      }
    } catch (error) {
      console.error('Error logging supplement intake:', error);
      alert('Failed to log supplement intake. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: Date[] = [];
    
    // Add previous month's days to fill the first week
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add next month's days to fill the last week
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const getTrackingForDate = (date: Date) => {
    return trackingData.filter(entry => {
      const entryDate = new Date(entry.takenAt);
      return entryDate.toDateString() === date.toDateString();
    });
  };



  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth() && 
           date.getFullYear() === currentMonth.getFullYear();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const generateMockWorkoutData = (date: Date): DayCard['workoutType'] | undefined => {
    // Mock data for demonstration - replace with real Strava/Garmin data later
    const random = Math.random();
    if (random > 0.7) {
      const workouts = ['Running', 'Cycling', 'Swimming', 'Weightlifting', 'Yoga'];
      return workouts[Math.floor(Math.random() * workouts.length)];
    }
    return undefined;
  };

  const getDaysForDisplay = () => {
    const days = getDaysInMonth(currentMonth);
    return days.map(date => {
      const supplementEntries = getTrackingForDate(date);
      const workoutType = generateMockWorkoutData(date);
      
      return {
        date,
        supplementEntries,
        hasWorkoutData: !!workoutType,
        workoutType,
        workoutDuration: workoutType ? `${Math.floor(Math.random() * 60) + 30} min` : undefined,
        workoutDistance: workoutType === 'Running' || workoutType === 'Cycling' ? 
          `${(Math.random() * 10 + 2).toFixed(1)} km` : undefined,
        workoutCalories: workoutType ? Math.floor(Math.random() * 500) + 100 : undefined
      };
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-100 mb-4">Loading...</h1>
          <p className="text-gray-400">Loading your supplement tracking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Main Content */}
      <div className="container-responsive py-8">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
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
            
            {/* Title and Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h1 className="text-4xl font-bold text-gray-100 mb-4">
                  Supplement Tracker
                </h1>
                <p className="text-xl text-gray-400">
                  Track your supplement intake and workout data
                </p>
              </div>
              
              {/* Month Navigation and View Toggle */}
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                {/* Month Navigation */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => changeMonth('prev')}
                    className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <h2 className="text-2xl font-bold text-gray-100 min-w-[200px] text-center">
                    {getMonthName(currentMonth)}
                  </h2>
                  
                  <button
                    onClick={() => changeMonth('next')}
                    className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400 mr-2">View:</span>
                  <button
                    onClick={() => setViewMode('month')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'month'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setViewMode('week')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'week'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Week
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mb-8">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-6 min-w-max">
                <div className="flex-shrink-0 w-48 bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-400">Total Entries</p>
                      <p className="text-xl font-bold text-gray-100">{trackingData.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 w-48 bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-400">This Month</p>
                      <p className="text-xl font-bold text-gray-100">
                        {trackingData.filter(entry => {
                          const entryDate = new Date(entry.takenAt);
                          return entryDate.getMonth() === currentMonth.getMonth() && 
                                 entryDate.getFullYear() === currentMonth.getFullYear();
                        }).length}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 w-48 bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-600 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-400">Unique Supplements</p>
                      <p className="text-xl font-bold text-gray-100">
                        {new Set(trackingData.map(entry => entry.supplementName)).size}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 w-48 bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-400">Workout Days</p>
                      <p className="text-xl font-bold text-gray-100">
                        {getDaysForDisplay().filter(day => day.hasWorkoutData).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Month Grid */}
          <div className="w-full overflow-x-auto">
            <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3 mb-8 min-w-0 calendar-grid" style={{ minWidth: '280px' }}>
            {/* Day Headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center py-1 sm:py-2">
                <span className="text-xs sm:text-sm font-medium text-gray-400">{day}</span>
              </div>
            ))}
            
            {/* Day Cards */}
            {getDaysForDisplay().map((dayData, index) => (
              <div
                key={index}
                className={`aspect-square p-1 sm:p-2 md:p-3 rounded-lg border transition-all cursor-pointer hover:shadow-lg calendar-day ${
                  isCurrentMonth(dayData.date)
                    ? isToday(dayData.date)
                      ? 'border-blue-500 bg-blue-900/20'
                      : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                    : 'border-gray-700 bg-gray-900/50'
                }`}
                onClick={() => handleDateClick(dayData.date)}
              >
                {/* Date Header */}
                <div className={`text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
                  isCurrentMonth(dayData.date) ? 'text-gray-100' : 'text-gray-500'
                }`}>
                  {dayData.date.getDate()}
                </div>
                
                {/* Supplement Entries */}
                {dayData.supplementEntries.length > 0 && (
                  <div className="space-y-0.5 sm:space-y-1 mb-1 sm:mb-2">
                    {dayData.supplementEntries.slice(0, 2).map(entry => (
                      <div key={entry.id} className="text-[10px] sm:text-xs bg-blue-600/20 text-blue-300 px-1 sm:px-2 py-0.5 sm:py-1 rounded truncate">
                        {entry.supplementName}
                      </div>
                    ))}
                    {dayData.supplementEntries.length > 2 && (
                      <div className="text-[10px] sm:text-xs text-gray-400 text-center">
                        +{dayData.supplementEntries.length - 2}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Workout Data Placeholder */}
                {dayData.hasWorkoutData && (
                  <div className="text-[10px] sm:text-xs bg-green-600/20 text-green-300 px-1 sm:px-2 py-0.5 sm:py-1 rounded truncate">
                    {dayData.workoutType}
                  </div>
                )}
                
                {/* Empty State */}
                {dayData.supplementEntries.length === 0 && !dayData.hasWorkoutData && (
                  <div className="text-[10px] sm:text-xs text-gray-500 text-center mt-2 sm:mt-4">
                    Click to log
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>

          {/* Log Supplement Modal */}
          {showLogForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md w-full mx-4">
                <h3 className="text-2xl font-bold text-gray-100 mb-6">
                  Log Supplement Intake
                </h3>
                
                <form onSubmit={(e) => { e.preventDefault(); handleLogSupplement(); }} className="space-y-4">
                  {/* Supplement Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Supplement *
                    </label>
                    <select
                      value={logForm.supplementId}
                      onChange={(e) => {
                        const selectedItem = pantryItems.find(item => item.productId.toString() === e.target.value);
                        if (selectedItem) {
                          handlePantryItemSelect(selectedItem);
                        }
                      }}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select from pantry</option>
                      {pantryItems.map(item => (
                        <option key={item.id} value={item.productId}>
                          {item.productName} - {item.brandName || 'No Brand'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dosage */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Dosage *
                      </label>
                      <input
                        type="number"
                        value={logForm.dosage}
                        onChange={(e) => setLogForm(prev => ({ ...prev, dosage: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Unit *
                      </label>
                      <select
                        value={logForm.unit}
                        onChange={(e) => setLogForm(prev => ({ ...prev, unit: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select unit</option>
                        <option value="mg">mg</option>
                        <option value="g">g</option>
                        <option value="mcg">mcg</option>
                        <option value="IU">IU</option>
                        <option value="capsule">Capsule</option>
                        <option value="tablet">Tablet</option>
                        <option value="serving">Serving</option>
                      </select>
                    </div>
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      When Taken *
                    </label>
                    <input
                      type="datetime-local"
                      value={logForm.takenAt}
                      onChange={(e) => setLogForm(prev => ({ ...prev, takenAt: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                      value={logForm.notes}
                      onChange={(e) => setLogForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any additional notes..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowLogForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Logging...' : 'Log Intake'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplementTracker;
