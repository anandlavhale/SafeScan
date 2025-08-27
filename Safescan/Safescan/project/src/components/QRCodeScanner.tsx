import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, Camera, AlertCircle } from 'lucide-react';

interface QRCodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (errorMessage: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ 
  onScanSuccess, 
  onScanError 
}) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    const qrScanner = new Html5QrcodeScanner(
      'qr-scanner',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    qrScanner.render(
      (decodedText) => {
        console.log('QR Code scanned:', decodedText);
        setIsScanning(false);
        onScanSuccess(decodedText);
      },
      (errorMessage) => {
        console.log('QR scan error:', errorMessage);
        if (onScanError) {
          onScanError(errorMessage);
        }
      }
    );

    setScanner(qrScanner);
    setIsScanning(true);

    return () => {
      try {
        qrScanner.clear();
      } catch (error) {
        console.error('Error clearing scanner:', error);
      }
    };
  }, [onScanSuccess, onScanError]);

  const handleCameraError = () => {
    setError('Unable to access camera. Please ensure camera permissions are granted.');
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Access Required</h3>
        <p className="text-gray-600 text-center max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <QrCode className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
          Scan Emergency QR Code
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          Point your camera at the QR code on the employee's ID
        </p>

        <div id="qr-scanner" ref={scannerRef} className="w-full" />

        {isScanning && (
          <div className="flex items-center justify-center mt-4">
            <Camera className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-600 font-medium">Camera is ready</span>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Instructions:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Hold your device steady</li>
          <li>• Ensure the QR code is well-lit</li>
          <li>• Keep the QR code within the scanning area</li>
          <li>• You'll be redirected automatically after scanning</li>
        </ul>
      </div>
    </div>
  );
};

export default QRCodeScanner;