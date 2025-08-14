import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './components/LandingPage';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import UserDashboard from './components/UserDashboard';
import UserProfile from './components/UserProfile';
import Pantry from './components/Pantry';
import SupplementTracker from './components/SupplementTracker';
import Settings from './components/Settings';
import HelpSupport from './components/HelpSupport';
import TermsLegal from './components/TermsLegal';
import PublicTerms from './components/PublicTerms';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/signin" element={<SignInForm />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
                                 <Route
                       path="/profile"
                       element={
                         <ProtectedRoute>
                           <UserProfile />
                         </ProtectedRoute>
                       }
                     />
                     <Route
                       path="/pantry"
                       element={
                         <ProtectedRoute>
                           <Pantry />
                         </ProtectedRoute>
                       }
                     />
                     <Route
                       path="/tracker"
                       element={
                         <ProtectedRoute>
                           <SupplementTracker />
                         </ProtectedRoute>
                       }
                     />
                     <Route
                       path="/settings"
                       element={
                         <ProtectedRoute>
                           <Settings />
                         </ProtectedRoute>
                       }
                     />
                     <Route
                       path="/help"
                       element={
                         <ProtectedRoute>
                           <HelpSupport />
                         </ProtectedRoute>
                       }
                     />
                     <Route
                       path="/terms"
                       element={
                         <ProtectedRoute>
                           <TermsLegal />
                         </ProtectedRoute>
                       }
                     />
                     <Route
                       path="/legal"
                       element={<PublicTerms />}
                     />
                   </Routes>
                 </div>
               </Router>
             </AuthProvider>
           </ThemeProvider>
         );
       }

export default App;
