import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCodeScanner from '../components/QRCodeScanner';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

const QRScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleScanSuccess = (decodedText: string) => {
    console.log('QR scan successful:', decodedText);
    setScanResult(decodedText);
    setIsRedirecting(true);

    // Extract employee ID from URL or use the decoded text directly
    try {
      const url = new URL(decodedText);
      const pathParts = url.pathname.split('/');
      const employeeIndex = pathParts.findIndex(part => part === 'employee');
      
      if (employeeIndex !== -1 && pathParts[employeeIndex + 1]) {
        const employeeId = pathParts[employeeIndex + 1];
        // Redirect to employee info page
        setTimeout(() => {
          navigate(`/employee/${employeeId}`);
        }, 1000);
      } else {
        throw new Error('Invalid QR code format');
      }
    } catch (error) {
      console.error('Invalid QR code URL:', error);
      // If it's not a URL, treat it as employee ID directly
      setTimeout(() => {
        navigate(`/employee/${decodedText}`);
      }, 1000);
    }
  };

  const handleScanError = (errorMessage: string) => {
    console.log('QR scan error:', errorMessage);
    // Most scan errors are normal (no QR code in view), so we don't show them
  };

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">QR Code Scanned!</h2>
          <p className="text-gray-600 mb-4">Redirecting to employee information...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Emergency QR Scanner
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scan the QR code on any employee ID to instantly access their emergency medical information, 
            allergies, medications, and emergency contacts.
          </p>
        </div>

        <div className="flex justify-center">
          <QRCodeScanner 
            onScanSuccess={handleScanSuccess}
            onScanError={handleScanError}
          />
        </div>

        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">For Emergency Use Only</h3>
              <p className="text-red-700 text-sm leading-relaxed">
                This system is designed for emergency responders, medical professionals, and authorized personnel only. 
                The medical information accessed through this system should be used solely for emergency medical care 
                and treatment purposes. Unauthorized use or sharing of this information is strictly prohibited.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-3">Scanner Tips:</h3>
          <ul className="text-blue-700 text-sm space-y-2">
            <li>• Ensure adequate lighting for best results</li>
            <li>• Hold your device steady and keep the QR code centered</li>
            <li>• If scanning fails, try adjusting the distance from the QR code</li>
            <li>• The camera will automatically detect and scan the QR code</li>
            <li>• You'll be redirected immediately after successful scanning</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRScannerPage;