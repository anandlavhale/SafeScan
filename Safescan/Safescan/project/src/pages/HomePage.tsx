import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Heart, Shield, Zap, Users, Phone } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-2xl shadow-lg">
                <Heart className="h-16 w-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Emergency Medical
              <span className="text-red-600 block">QR System</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Instant access to critical medical information when it matters most. 
              Scan QR codes on employee IDs to view emergency medical data, allergies, 
              medications, and emergency contacts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/scan"
                className="bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg flex items-center justify-center space-x-3"
              >
                <QrCode className="h-6 w-6" />
                <span>Scan QR Code Now</span>
              </Link>
              
              <Link
                to="/login"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center space-x-3"
              >
                <Shield className="h-6 w-6" />
                <span>Admin Access</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Emergency QR System?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for emergency responders, medical professionals, and workplace safety teams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-red-500 p-3 rounded-lg w-fit mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Instant Access
              </h3>
              <p className="text-gray-600">
                Scan any employee QR code and immediately access critical medical information, 
                allergies, medications, and emergency contacts.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-500 p-3 rounded-lg w-fit mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Complete Employee Management
              </h3>
              <p className="text-gray-600">
                Comprehensive admin dashboard to manage employee profiles, 
                medical data, and generate printable QR codes for ID badges.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-green-500 p-3 rounded-lg w-fit mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Emergency Contacts
              </h3>
              <p className="text-gray-600">
                One-tap calling to emergency contacts and physicians directly from 
                the scanned employee information page.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple, fast, and reliable emergency medical information access
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '1',
                title: 'Employee Registration',
                description: 'Admin adds employee medical data and emergency contacts to the system'
              },
              {
                step: '2',
                title: 'QR Code Generation',
                description: 'System generates unique QR code for each employee to print on ID badges'
              },
              {
                step: '3',
                title: 'Emergency Scan',
                description: 'First responders scan the QR code during emergency situations'
              },
              {
                step: '4',
                title: 'Instant Information',
                description: 'Critical medical data and emergency contacts displayed immediately'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Set up your emergency medical QR system in minutes and ensure your team's safety.
          </p>
          <Link
            to="/register"
            className="bg-white text-red-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center space-x-3"
          >
            <Shield className="h-6 w-6" />
            <span>Start Free Trial</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;