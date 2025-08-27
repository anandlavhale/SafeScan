import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, QrCode, Settings, LogOut, LogIn } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-red-500 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Emergency Medical</span>
              <span className="text-sm text-red-600 block -mt-1">QR System</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/scan"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/scan')
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <QrCode className="h-5 w-5" />
              <span>Scan QR Code</span>
            </Link>

            {user && (
              <Link
                to="/admin"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/admin')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">
                  Welcome, {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/scan"
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isActive('/scan')
                ? 'bg-red-100 text-red-700'
                : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <QrCode className="h-5 w-5" />
            <span>Scan QR Code</span>
          </Link>

          {user && (
            <Link
              to="/admin"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/admin')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Admin Panel</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;