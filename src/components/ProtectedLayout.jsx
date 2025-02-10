// ProtectedLayout.jsx
// import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
function ProtectedLayout({ user }) {
  if (!user) {
    // User not authenticated, redirect to the auth page
    return <Navigate to="/auth" replace />;
  }
  // User is authenticated, render the nested routes
  return <Outlet />;
}

export default ProtectedLayout;
