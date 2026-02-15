import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FEATURES from '../config/features';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('🏷️ Header - User:', user);
  console.log('🏷️ Header - User email:', user?.email);
  console.log('🏷️ Header - Current location:', location.pathname);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                PosterAI
              </Link>
            </div>

            {user && (
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-4">
                {FEATURES.enableStripeCheckout && (
                  <>
                    <Link
                      to="/questionnaire"
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive('/questionnaire')
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      Create Poster
                    </Link>
                    <Link
                      to="/drafts"
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive('/drafts')
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      My Drafts
                    </Link>
                    <Link
                      to="/orders"
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive('/orders')
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      My Orders
                    </Link>
                  </>
                )}
              </nav>
            )}
          </div>

          {/* User menu */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-md"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive('/login')
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
