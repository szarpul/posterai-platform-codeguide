import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QuestionnaireProvider } from './contexts/QuestionnaireContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import ToastProvider from './components/ui/Toast';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuestionnairePage from './pages/QuestionnairePage';
import DraftsPage from './pages/DraftsPage';
import PosterDetailPage from './pages/PosterDetailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersPage from './pages/OrdersPage';
import FEATURES from './config/features';

// Protected route wrapper
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const enableStripeCheckout = FEATURES.enableStripeCheckout;
  const enableAnonymousImageGeneration = FEATURES.enableAnonymousImageGeneration;

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <AuthProvider>
            <QuestionnaireProvider>
              <Layout>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                  {/* Questionnaire: public when anonymous generation enabled, otherwise protected */}
                  <Route
                    path="/questionnaire"
                    element={
                      enableAnonymousImageGeneration ? (
                        <QuestionnairePage />
                      ) : (
                        <PrivateRoute>
                          <QuestionnairePage />
                        </PrivateRoute>
                      )
                    }
                  />
                  <Route
                    path="/drafts"
                    element={
                      <PrivateRoute>
                        {enableStripeCheckout ? (
                          <DraftsPage />
                        ) : (
                          <Navigate to="/questionnaire" replace />
                        )}
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <PrivateRoute>
                        {enableStripeCheckout ? (
                          <OrdersPage />
                        ) : (
                          <Navigate to="/questionnaire" replace />
                        )}
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/poster/:id"
                    element={
                      <PrivateRoute>
                        {enableStripeCheckout ? (
                          <PosterDetailPage />
                        ) : (
                          <Navigate to="/questionnaire" replace />
                        )}
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/checkout/:orderId"
                    element={
                      <PrivateRoute>
                        {enableStripeCheckout ? (
                          <CheckoutPage />
                        ) : (
                          <Navigate to="/questionnaire" replace />
                        )}
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/order-success/:orderId"
                    element={
                      <PrivateRoute>
                        <OrderSuccessPage />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </Layout>
            </QuestionnaireProvider>
          </AuthProvider>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
