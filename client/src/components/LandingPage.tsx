import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="container-responsive">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-xl">AI</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">SupplementAdvisor</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 font-medium">How It Works</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 font-medium">About</a>
            </div>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/signin" className="text-gray-600 hover:text-blue-600 font-medium">
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-600 hover:text-blue-600 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 pt-4 pb-2">
              <div className="flex flex-col space-y-3">
                <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium py-2">Features</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 font-medium py-2">How It Works</a>
                <a href="#about" className="text-gray-600 hover:text-blue-600 font-medium py-2">About</a>
                <hr className="border-gray-200" />
                <Link to="/signin" className="text-gray-600 hover:text-blue-600 font-medium py-2">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary text-center">
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="container-responsive text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Track & Manage Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 block sm:inline"> Supplement Journey</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A comprehensive platform for athletes and fitness enthusiasts to track supplement intake, 
            manage their supplement database, and prepare for AI-powered performance analysis. 
            Connect with Strava and Garmin to correlate supplements with your fitness data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-lg px-6 sm:px-8 py-3 sm:py-4">
              Start Your Journey
            </Link>
            <button className="btn-outline text-lg px-6 sm:px-8 py-3 sm:py-4">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Fitness Integration Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container-responsive">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-16">
            Fitness Tracking Integration
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 text-center mb-8 sm:mb-16 max-w-3xl mx-auto px-4">
            Connect your favorite fitness platforms to correlate supplement intake with performance data. 
            Get insights that only comprehensive tracking can provide.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 max-w-5xl mx-auto">
            {/* Strava Integration */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-200">
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 text-center sm:text-left">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.387 17.944c-.386.199-.386.758 0 .957l6.086 3.141c.386.199.697.199 1.083 0l6.086-3.141c.386-.199-.386-.758 0-.957l-6.086-3.141c-.386-.199-.697-.199-1.083 0l-6.086 3.141z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Strava</h3>
                  <p className="text-gray-600">The world's leading fitness community</p>
                </div>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Track running, cycling, and swimming activities
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Analyze performance trends and improvements
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Correlate supplement timing with workout results
                </li>
              </ul>
              <div className="mt-6">
                <span className="inline-block bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
            </div>
            
            {/* Garmin Integration */}
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-200">
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 text-center sm:text-left">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Garmin Connect</h3>
                  <p className="text-gray-600">Professional-grade fitness tracking</p>
                </div>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Heart rate, GPS, and biometric data
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Advanced workout metrics and analysis
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Sleep, recovery, and stress monitoring
                </li>
              </ul>
              <div className="mt-6">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8 sm:mt-12 px-4">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 inline-block max-w-md">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">AI-Powered Correlation Analysis</h4>
              <p className="text-sm sm:text-base text-gray-600">Our advanced algorithms will analyze your supplement intake alongside fitness data to provide personalized insights and recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-20 bg-white">
        <div className="container-responsive">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-16 px-4">
            What Can SupplementAdvisor Do For You?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Supplement Tracking</h3>
              <p className="text-gray-600">
                Log your supplement intake with timestamps, dosages, and notes. Track your progress over time.
              </p>
            </div>
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Comprehensive Supplement Database</h3>
              <p className="text-gray-600">
                Access our extensive database of verified supplements and add custom items. Build your personal collection with confidence.
              </p>
            </div>
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Chatbot Dashboard</h3>
              <p className="text-gray-600">
                Modern messenger-style interface that scales perfectly from mobile to desktop. Intuitive and familiar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Features Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container-responsive">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-16 px-4">
            Available Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Profiles</h3>
              <p className="text-gray-600 text-sm">Complete profiles with sports, allergies, height, weight, and health information</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Supplement Database</h3>
              <p className="text-gray-600 text-sm">Search our comprehensive supplement database and add custom items to your personal collection</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Intake Tracking</h3>
              <p className="text-gray-600 text-sm">Calendar-based tracking with timestamps, dosages, and workout data placeholders</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chatbot Interface</h3>
              <p className="text-gray-600 text-sm">Modern messenger-style dashboard that works perfectly on mobile and desktop</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Foundation</h3>
              <p className="text-gray-600 text-sm">Build comprehensive supplement and health data for future AI analysis</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600 text-sm">Your health data is encrypted and stored securely on your own device</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 sm:py-20">
        <div className="container-responsive">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-16 px-4">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your profile with your sports and health information</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Build Your Database</h3>
              <p className="text-gray-600">Add supplements from our comprehensive database or create custom entries</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Your Intake</h3>
              <p className="text-gray-600">Log supplement consumption with timestamps and dosages</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                 <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prepare for AI Analysis</h3>
              <p className="text-gray-600">Build your data foundation for future performance insights</p>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container-responsive text-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Connect Your Fitness & Supplements?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join athletes and fitness enthusiasts who are building comprehensive data foundations for AI-powered performance insights.
          </p>
          <Link to="/signup" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 inline-block">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container-responsive">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-lg font-bold">SupplementAdvisor</span>
              </div>
              <p className="text-gray-400">
                Comprehensive supplement tracking and management platform for athletes and fitness enthusiasts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white bg-transparent border-none p-0 cursor-pointer text-left" onClick={() => alert('Features coming soon!')}>Features</button></li>
                <li><button className="hover:text-white bg-transparent border-none p-0 cursor-pointer text-left" onClick={() => alert('Pricing coming soon!')}>Pricing</button></li>
                <li><button className="hover:text-white bg-transparent border-none p-0 cursor-pointer text-left" onClick={() => alert('API coming soon!')}>API</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white bg-transparent border-none p-0 cursor-pointer text-left" onClick={() => alert('About coming soon!')}>About</button></li>
                <li><button className="hover:text-white bg-transparent border-none p-0 cursor-pointer text-left" onClick={() => alert('Blog coming soon!')}>Blog</button></li>
                <li><button className="hover:text-white bg-transparent border-none p-0 cursor-pointer text-left" onClick={() => alert('Careers coming soon!')}>Careers</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white bg-transparent border-none p-0 cursor-pointer text-left" onClick={() => alert('Help Center coming soon!')}>Help Center</button></li>
                <li><button className="hover:text-white bg-transparent border-none p-0 cursor-pointer text-left" onClick={() => alert('Contact coming soon!')}>Contact</button></li>
                <li><button className="hover:text-white bg-transparent border-none p-0 cursor-pointer text-left" onClick={() => alert('Privacy coming soon!')}>Privacy</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white bg-transparent border-none p-0 cursor-pointer text-left" onClick={() => window.open('/legal', '_self')}>Terms of Service</button></li>
                <li><button className="hover:text-white bg-transparent border-none p-0 cursor-pointer text-left" onClick={() => window.open('/legal', '_self')}>Privacy Policy</button></li>
                <li><button className="hover:text-white bg-transparent border-none p-0 cursor-pointer text-left" onClick={() => alert('Cookie Policy coming soon!')}>Cookie Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AI SupplementAdvisor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
