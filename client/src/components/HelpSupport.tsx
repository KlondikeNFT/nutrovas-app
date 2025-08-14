import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'supplements' | 'tracking' | 'account' | 'technical';
}

const HelpSupport: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqData: FAQItem[] = [
    // General Questions
    {
      question: "What is SupplementAdvisor?",
      answer: "SupplementAdvisor is a comprehensive platform for athletes and fitness enthusiasts to track supplement intake, manage their supplement database, and prepare for AI-powered performance analysis. It helps you monitor what supplements you're taking, when you're taking them, and correlate them with your fitness data.",
      category: "general"
    },
    {
      question: "How do I get started?",
      answer: "Getting started is easy! Simply sign up for an account, complete your profile with your sports and allergies, and start adding supplements to your pantry. You can then begin tracking your daily supplement intake and view your progress over time.",
      category: "general"
    },
    {
      question: "Is SupplementAdvisor free to use?",
      answer: "Currently, SupplementAdvisor offers a free tier with access to core features including supplement tracking, pantry management, and basic analytics. Premium features including advanced AI analysis and fitness platform integrations will be available soon.",
      category: "general"
    },

    // Supplement Related
    {
      question: "How do I add supplements to my pantry?",
      answer: "You can add supplements in two ways: 1) Search our comprehensive database for existing supplements, or 2) Add custom supplements by filling out a form with the product details. Our system will check for duplicates to maintain data quality.",
      category: "supplements"
    },
    {
      question: "What if I can't find a supplement in the database?",
      answer: "If you can't find a supplement in our database, you can add it as a custom supplement. Simply click 'Add Custom Supplement' in your pantry and fill out the form with the product name, brand, dosage, and other relevant information.",
      category: "supplements"
    },
    {
      question: "How do I track my supplement intake?",
      answer: "To track supplement intake, go to your dashboard and click 'Log new intake' or use the Calendar page. Fill out the form with the supplement name, dosage, time taken, and any notes. You can also log intake directly from the calendar view.",
      category: "supplements"
    },

    // Tracking & Analytics
    {
      question: "How does the supplement tracking work?",
      answer: "Supplement tracking allows you to log when you take supplements, including the dosage, time, and any notes. This data is stored and can be viewed in a calendar format, helping you maintain consistency and track your supplement routine over time.",
      category: "tracking"
    },
    {
      question: "Can I view my supplement history?",
      answer: "Yes! You can view your supplement history in the Calendar/Tracker page. This shows your daily supplement intake in a card-based layout organized by month, making it easy to see patterns and track your consistency.",
      category: "tracking"
    },
    {
      question: "Will I be able to connect fitness platforms?",
      answer: "Yes! We're working on integrations with Strava and Garmin Connect. This will allow you to correlate your supplement intake with workout data, providing insights into how supplements may be affecting your performance.",
      category: "tracking"
    },

    // Account & Profile
    {
      question: "How do I update my profile information?",
      answer: "You can update your profile by going to the Profile page from your dashboard. Click the edit button to modify your personal information, sports, allergies, height, weight, and other details. Changes are saved automatically.",
      category: "account"
    },
    {
      question: "Can I change my password?",
      answer: "Password changes can be made through the Settings page. Go to Settings → Security to update your password. Make sure to use a strong, unique password for security.",
      category: "account"
    },
    {
      question: "How do I manage my notification preferences?",
      answer: "Notification preferences can be managed in the Settings page. Go to Settings → Notifications to control email notifications, push notifications, and supplement reminders.",
      category: "account"
    },

    // Technical Support
    {
      question: "The app isn't loading properly. What should I do?",
      answer: "Try refreshing the page first. If the issue persists, check your internet connection and try clearing your browser cache. If problems continue, contact our support team with details about your browser and device.",
      category: "technical"
    },
    {
      question: "How do I switch between light and dark themes?",
      answer: "You can switch themes in the Settings page. Go to Settings → Appearance and choose between Light and Dark mode. The theme will be applied immediately and saved for future visits.",
      category: "technical"
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security seriously. All data is encrypted in transit and at rest. We use industry-standard security practices and never share your personal information with third parties without your explicit consent.",
      category: "technical"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', count: faqData.length },
    { id: 'general', name: 'General', count: faqData.filter(faq => faq.category === 'general').length },
    { id: 'supplements', name: 'Supplements', count: faqData.filter(faq => faq.category === 'supplements').length },
    { id: 'tracking', name: 'Tracking', count: faqData.filter(faq => faq.category === 'tracking').length },
    { id: 'account', name: 'Account', count: faqData.filter(faq => faq.category === 'account').length },
    { id: 'technical', name: 'Technical', count: faqData.filter(faq => faq.category === 'technical').length }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-100 mb-4">Loading...</h1>
          <p className="text-gray-400">Loading help and support...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container-responsive py-8">
        <div className="max-w-6xl mx-auto">
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
                Help & Support
              </h1>
              <p className="text-xl text-gray-400">
                Find answers to common questions and get the help you need
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pl-12 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="w-6 h-6 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mb-8">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 min-w-max">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                      activeCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-200'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-4 text-left hover:bg-gray-700 transition-colors flex items-center justify-between"
                    >
                      <span className="text-gray-100 font-medium">{faq.question}</span>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedFAQ === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {expandedFAQ === index && (
                      <div className="px-6 pb-4">
                        <div className="border-t border-gray-700 pt-4">
                          <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-400 mb-2">No results found</h3>
                  <p className="text-gray-500">Try adjusting your search or category filter</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact & Additional Help */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Support */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">Contact Support</h2>
                  <p className="text-gray-400">Need more help? Get in touch with our team</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                  <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-300">support@supplementadvisor.com</span>
                </div>
                
                <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-300">Response within 24 hours</span>
                </div>
                
                <button
                  onClick={() => window.open('mailto:support@supplementadvisor.com', '_blank')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Send Email
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">Quick Actions</h2>
                  <p className="text-gray-400">Common tasks and shortcuts</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.history.back()}
                  className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="text-gray-300">Return to Dashboard</span>
                </button>
                
                <button
                  onClick={() => window.open('/settings', '_self')}
                  className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                  <span className="text-gray-300">Go to Settings</span>
                </button>
                
                                  <button
                    onClick={() => window.open('/profile', '_self')}
                    className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center"
                  >
                    <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-300">View Profile</span>
                  </button>
                  
                  <button
                    onClick={() => window.open('/terms', '_self')}
                    className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center"
                  >
                    <svg className="w-5 h-5 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-gray-300">Terms & Legal</span>
                  </button>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-12 bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Additional Resources</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">User Guide</h3>
                <p className="text-gray-400 text-sm">Comprehensive guide to using SupplementAdvisor</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">Tips & Tricks</h3>
                <p className="text-gray-400 text-sm">Get the most out of your supplement tracking</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">FAQ Updates</h3>
                <p className="text-gray-400 text-sm">Stay updated with new features and answers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
