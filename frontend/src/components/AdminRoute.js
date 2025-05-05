import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser || currentUser.role !== 'admin') {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>Access Denied: Admins Only</div>;
  }

  return children;
};

export default AdminRoute; 