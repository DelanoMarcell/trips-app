import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, requiredRole, ...rest }) => {



  const isAuthenticated = false;
  const userRole = 'admin'

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/home" />;
  }

  return <Route {...rest} element={Component} />;
};

export default ProtectedRoute;
