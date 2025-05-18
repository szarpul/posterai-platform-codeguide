import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QuestionnaireProvider } from './contexts/QuestionnaireContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuestionnairePage from './pages/QuestionnairePage';
import DraftsPage from './pages/DraftsPage';
import PosterDetailPage from './pages/PosterDetailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Protected route wrapper
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
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
              
              {/* Protected routes */}
              <Route
                path="/questionnaire"
                element={
                  <PrivateRoute>
                    <QuestionnairePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/drafts"
                element={
                  <PrivateRoute>
                    <DraftsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/poster/:id"
                element={
                  <PrivateRoute>
                    <PosterDetailPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Layout>
        </QuestionnaireProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 