import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    ({ message, type = 'info', duration = 5000 }) => {
      const id = Date.now();
      const newToast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message, duration) => {
      addToast({ message, type: 'success', duration });
    },
    [addToast]
  );

  const error = useCallback(
    (message, duration) => {
      addToast({ message, type: 'error', duration });
    },
    [addToast]
  );

  const info = useCallback(
    (message, duration) => {
      addToast({ message, type: 'info', duration });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, success, error, info, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="max-w-sm"
          >
            <Toast toast={toast} onClose={() => removeToast(toast.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const Toast = ({ toast, onClose }) => {
  const { type, message } = toast;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-success-50',
          border: 'border-success-200',
          text: 'text-success-800',
          icon: '✓',
          iconBg: 'bg-success-500',
        };
      case 'error':
        return {
          bg: 'bg-error-50',
          border: 'border-error-200',
          text: 'text-error-800',
          icon: '✕',
          iconBg: 'bg-error-500',
        };
      case 'info':
      default:
        return {
          bg: 'bg-primary-50',
          border: 'border-primary-200',
          text: 'text-primary-800',
          icon: 'ℹ',
          iconBg: 'bg-primary-500',
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-lg shadow-medium p-4`}>
      <div className="flex items-start">
        <div
          className={`${styles.iconBg} rounded-full w-6 h-6 flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5`}
        >
          {styles.icon}
        </div>
        <div className="flex-1">
          <p className={`${styles.text} text-sm font-medium`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span className="sr-only">Close</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ToastProvider;
