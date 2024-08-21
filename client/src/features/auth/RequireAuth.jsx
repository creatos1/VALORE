import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectCurrentRol, selectCurrentUser, selectCurrentToken } from './authSlice';
import { useSelector } from 'react-redux';

const RequireAuth = ({ allowedRoles }) => {
    const token = localStorage.getItem('token')
    const rol = localStorage.getItem('rol')
    const user = localStorage.getItem('user')
    
    const location = useLocation();
    return (
        token && allowedRoles?.includes(rol)
          ? <Outlet />
          : token
            ? <Navigate to="/unauthorized" state={{ from: location }} replace />
            : <Navigate to="/login" state={{ from: location }} replace />
      );
    };

export default RequireAuth;