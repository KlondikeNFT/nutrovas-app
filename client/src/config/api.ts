// API Configuration
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative URLs in production (Netlify)
  : 'http://localhost:3001'; // Use localhost in development

export const API_ENDPOINTS = {
  // Auth
  SIGNUP: '/api/auth/signup',
  LOGIN: '/api/auth/login',
  PROFILE: '/api/auth/profile',
  
  // Pantry
  PANTRY: '/api/pantry',
  PANTRY_ADD: '/api/pantry/add',
  PANTRY_REMOVE: '/api/pantry',
  
  // Custom Supplements
  CUSTOM_SUPPLEMENTS: '/api/custom-supplements',
  CUSTOM_SUPPLEMENTS_ADD: '/api/custom-supplements/add',
  
  // Supplement Tracking
  SUPPLEMENT_TRACKING: '/api/supplement-tracking',
  SUPPLEMENT_TRACKING_LOG: '/api/supplement-tracking/log',
  
  // DSLD Search
  DSLD_SEARCH: '/api/dsld/search',
  
  // Strava
  STRAVA_CONNECT: '/api/auth/strava/connect',
  STRAVA_CALLBACK: '/api/auth/strava/callback',
  STRAVA_STATUS: '/api/auth/strava/status',
  STRAVA_SYNC: '/api/auth/strava/sync',
  
  // Activities
  ACTIVITIES: '/api/activities',
  
  // Health
  HEALTH: '/api/health'
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
