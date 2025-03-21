import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children}: PrivateRouteProps) {
  const location = useLocation();

  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if(user.role === 'STUDENT' && location.pathname.includes('instructor')) return <Navigate to="/" />;
  if (user.role === 'INSTRUCTOR' && !location.pathname.includes('instructor')) return <Navigate to="/instructor" />;
  
  return <>{children}</>;
}