import React from 'react';

const PublicTerms: React.FC = () => {
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
                Back to Landing Page
              </button>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-100 mb-4">
                Terms of Service & Privacy Policy
              </h1>
              <p className="text-xl text-gray-400">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Table of Contents</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <a href="#terms" className="block text-blue-400 hover:text-blue-300 transition-colors">1. Terms of Service</a>
                <a href="#privacy" className="block text-blue-400 hover:text-blue-300 transition-colors">2. Privacy Policy</a>
                <a href="#data" className="block text-blue-400 hover:text-blue-300 transition-colors">3. Data Collection & Usage</a>
                <a href="#security" className="block text-blue-400 hover:text-blue-300 transition-colors">4. Data Security</a>
              </div>
              <div className="space-y-2">
                <a href="#cookies" className="block text-blue-400 hover:text-blue-300 transition-colors">5. Cookies & Tracking</a>
                <a href="#third-party" className="block text-blue-400 hover:text-blue-300 transition-colors">6. Third-Party Services</a>
                <a href="#user-rights" className="block text-blue-400 hover:text-blue-300 transition-colors">7. User Rights</a>
                <a href="#contact" className="block text-blue-400 hover:text-blue-300 transition-colors">8. Contact Information</a>
              </div>
            </div>
          </div>

          {/* Terms of Service */}
          <div id="terms" className="mb-12">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-3xl font-bold text-gray-100 mb-6">1. Terms of Service</h2>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Acceptance of Terms</h3>
                  <p>By accessing and using SupplementAdvisor, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Use License</h3>
                  <p>Permission is granted to temporarily download one copy of SupplementAdvisor for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained in SupplementAdvisor</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">User Responsibilities</h3>
                  <p>As a user of SupplementAdvisor, you agree to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Use the service in compliance with applicable laws</li>
                    <li>Not share your account with others</li>
                    <li>Report any security concerns immediately</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Service Availability</h3>
                  <p>SupplementAdvisor strives to maintain high availability but does not guarantee uninterrupted service. We reserve the right to modify, suspend, or discontinue the service at any time with or without notice.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Policy */}
          <div id="privacy" className="mb-12">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-3xl font-bold text-gray-100 mb-6">2. Privacy Policy</h2>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Information We Collect</h3>
                  <p>SupplementAdvisor collects information you provide directly to us, including:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Account information (username, email, password)</li>
                    <li>Personal information (name, date of birth, height, weight)</li>
                    <li>Health and fitness data (sports, allergies)</li>
                    <li>Supplement usage and tracking data</li>
                    <li>Communication preferences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">How We Use Your Information</h3>
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Provide and maintain our services</li>
                    <li>Process your supplement tracking data</li>
                    <li>Send you important updates and notifications</li>
                    <li>Improve our services and user experience</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Information Sharing</h3>
                  <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>To comply with legal requirements</li>
                    <li>To protect our rights and safety</li>
                    <li>With service providers who assist in operating our service</li>
                    <li>In the event of a business transfer or merger</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Data Collection & Usage */}
          <div id="data" className="mb-12">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-3xl font-bold text-gray-100 mb-6">3. Data Collection & Usage</h2>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Supplement Data</h3>
                  <p>We collect and store information about supplements you add to your pantry, including:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Product names and brands</li>
                    <li>Dosage information and units</li>
                    <li>Usage timestamps and frequency</li>
                    <li>Personal notes and observations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Health Information</h3>
                  <p>Your health-related data is used solely to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Provide personalized supplement recommendations</li>
                    <li>Track your supplement routine</li>
                    <li>Generate insights and analytics</li>
                    <li>Ensure safe supplement usage</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Analytics and Research</h3>
                  <p>We may use anonymized, aggregated data for:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Improving our services</li>
                    <li>Understanding user behavior patterns</li>
                    <li>Developing new features</li>
                    <li>Research and development purposes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div id="security" className="mb-12">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-3xl font-bold text-gray-100 mb-6">4. Data Security</h2>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Security Measures</h3>
                  <p>We implement industry-standard security measures to protect your data:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Secure authentication and authorization</li>
                    <li>Regular security audits and updates</li>
                    <li>Access controls and monitoring</li>
                    <li>Secure data centers and infrastructure</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Data Retention</h3>
                  <p>We retain your personal data for as long as necessary to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Provide our services</li>
                    <li>Comply with legal obligations</li>
                    <li>Resolve disputes</li>
                    <li>Enforce our agreements</li>
                  </ul>
                  <p className="mt-2">You may request deletion of your data at any time through your account settings.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cookies & Tracking */}
          <div id="cookies" className="mb-12">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-3xl font-bold text-gray-100 mb-6">5. Cookies & Tracking</h2>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Cookies</h3>
                  <p>SupplementAdvisor uses cookies to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Remember your login status</li>
                    <li>Store your preferences and settings</li>
                    <li>Analyze website usage and performance</li>
                    <li>Provide personalized content</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Third-Party Analytics</h3>
                  <p>We may use third-party analytics services to understand how our service is used. These services may collect:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Device and browser information</li>
                    <li>Usage patterns and interactions</li>
                    <li>Performance metrics</li>
                    <li>Error reports and diagnostics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Third-Party Services */}
          <div id="third-party" className="mb-12">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-3xl font-bold text-gray-100 mb-6">6. Third-Party Services</h2>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Fitness Platform Integration</h3>
                  <p>SupplementAdvisor may integrate with third-party fitness platforms such as Strava and Garmin Connect. When you connect these services:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>We only access data you explicitly authorize</li>
                    <li>Data is used solely for supplement effectiveness analysis</li>
                    <li>You can disconnect these services at any time</li>
                    <li>Third-party terms and privacy policies apply</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Service Providers</h3>
                  <p>We may use trusted third-party service providers for:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Hosting and infrastructure</li>
                    <li>Database management</li>
                    <li>Email services</li>
                    <li>Analytics and monitoring</li>
                  </ul>
                  <p className="mt-2">All service providers are bound by strict confidentiality agreements.</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Rights */}
          <div id="user-rights" className="mb-12">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-3xl font-bold text-gray-100 mb-6">7. User Rights</h2>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Your Rights</h3>
                  <p>You have the following rights regarding your personal data:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your data</li>
                    <li><strong>Portability:</strong> Export your data in a portable format</li>
                    <li><strong>Restriction:</strong> Limit how we process your data</li>
                    <li><strong>Objection:</strong> Object to certain processing activities</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Exercising Your Rights</h3>
                  <p>To exercise any of these rights:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Use the settings in your account dashboard</li>
                    <li>Contact our support team directly</li>
                    <li>Send a written request to our privacy officer</li>
                  </ul>
                  <p className="mt-2">We will respond to your request within 30 days.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div id="contact" className="mb-12">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-3xl font-bold text-gray-100 mb-6">8. Contact Information</h2>
              
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Questions and Concerns</h3>
                  <p>If you have any questions about these terms or our privacy practices, please contact us:</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-100 mb-2">General Support</h4>
                    <p className="text-gray-300">support@supplementadvisor.com</p>
                    <p className="text-gray-400 text-sm mt-1">For technical issues and general questions</p>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-100 mb-2">Privacy Officer</h4>
                    <p className="text-gray-300">privacy@supplementadvisor.com</p>
                    <p className="text-gray-400 text-sm mt-1">For privacy and data protection concerns</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">Updates to This Policy</h3>
                  <p>We may update these terms and privacy policy from time to time. We will notify you of any material changes by:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                    <li>Posting the updated policy on our website</li>
                    <li>Sending you an email notification</li>
                    <li>Displaying a notice in the application</li>
                  </ul>
                  <p className="mt-2">Your continued use of SupplementAdvisor after any changes constitutes acceptance of the updated terms.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-gray-400">
              By using SupplementAdvisor, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and Privacy Policy.
            </p>
            <div className="mt-4">
              <button
                onClick={() => window.history.back()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Return to Landing Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicTerms;


