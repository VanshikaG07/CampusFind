import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingState from './LoadingState';

/**
 * Route guard component for authenticated-only routes.
 * Redirects to /login if access_token or user does not exist.
 */
export default function ProtectedRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState message="Checking student session..." />;
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
          message: 'Please log in with your student account to access this page.',
        }}
        replace
      />
    );
  }

  return children;
}
