import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';

export default function Layout({ children }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleSignOut() {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  }

  const navigation = [
    { name: 'Create', href: '/questionnaire', protected: true },
    { name: 'Drafts', href: '/drafts', protected: true },
    { name: 'Orders', href: '/orders', protected: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-cream grain">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-cream/80 border-b border-charcoal/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-medium"
                  whileHover={{ scale: 1.05, rotate: -3 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <span className="text-white font-display font-bold text-lg">P</span>
                </motion.div>
                <span className="text-xl font-display font-semibold text-charcoal">
                  Poster<span className="text-primary-500">AI</span>
                </span>
              </Link>

              {/* Desktop Navigation */}
              {user && (
                <div className="hidden md:ml-10 md:flex md:items-center md:space-x-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                        isActive(item.href)
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-charcoal-light hover:text-charcoal hover:bg-cream-dark'
                      }`}
                    >
                      {item.name}
                      {isActive(item.href) && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-secondary-100 flex items-center justify-center ring-2 ring-secondary-200">
                      <span className="text-secondary-700 font-medium text-sm">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-charcoal-light hidden lg:block">
                      {user.email}
                    </span>
                  </div>
                  <Button onClick={handleSignOut} variant="ghost" size="sm">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button to="/login" variant="ghost" size="sm">
                    Sign In
                  </Button>
                  <Button to="/register" size="sm">
                    Get Started
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-charcoal hover:text-primary-600 hover:bg-cream-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors"
              >
                <span className="sr-only">Open main menu</span>
                <motion.div
                  animate={mobileMenuOpen ? 'open' : 'closed'}
                  className="w-6 h-6 flex flex-col justify-center items-center"
                >
                  <motion.span
                    className="w-5 h-0.5 bg-current block"
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: 45, y: 2 },
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className="w-5 h-0.5 bg-current block mt-1"
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 },
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className="w-5 h-0.5 bg-current block mt-1"
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: -45, y: -6 },
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-charcoal/5 bg-cream"
            >
              <div className="px-4 pt-3 pb-4 space-y-1">
                {user &&
                  navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-charcoal hover:bg-cream-dark'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}

                <div className="pt-4 mt-4 border-t border-charcoal/5">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center px-4 py-2">
                        <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center mr-3">
                          <span className="text-secondary-700 font-medium">
                            {user.email?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-charcoal-light truncate">{user.email}</span>
                      </div>
                      <Button
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                        variant="outline"
                        fullWidth
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        to="/login"
                        variant="outline"
                        fullWidth
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Button>
                      <Button to="/register" fullWidth onClick={() => setMobileMenuOpen(false)}>
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-charcoal/5 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">P</span>
              </div>
              <span className="text-sm text-charcoal-light">
                PosterAI - AI-powered poster creation
              </span>
            </div>
            <div className="text-sm text-warm-gray">
              &copy; {new Date().getFullYear()} PosterAI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
