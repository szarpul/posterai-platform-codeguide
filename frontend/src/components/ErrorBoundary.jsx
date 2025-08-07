import React from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sm:mx-auto sm:w-full sm:max-w-md"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-16 h-16 bg-error-500 rounded-2xl flex items-center justify-center mb-4"
              >
                <span className="text-white text-2xl">⚠️</span>
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Something went wrong</h2>
              <p className="text-gray-600">We're sorry, but something unexpected happened</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="sm:mx-auto sm:w-full sm:max-w-md"
          >
            <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-8">
              <div className="text-center mb-6">
                <p className="text-gray-600 mb-6">
                  Don't worry, this is likely a temporary issue. You can try refreshing the page or going back to the homepage.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={this.handleRetry}
                  fullWidth
                  size="lg"
                >
                  Try Again
                </Button>
                
                <Button
                  to="/"
                  variant="outline"
                  fullWidth
                  size="lg"
                >
                  Go to Homepage
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                    Error Details (Development)
                  </summary>
                  <div className="bg-gray-100 p-4 rounded-lg text-xs font-mono text-gray-800 overflow-auto">
                    <div className="mb-2">
                      <strong>Error:</strong>
                      <pre className="mt-1">{this.state.error.toString()}</pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1">{this.state.errorInfo.componentStack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
