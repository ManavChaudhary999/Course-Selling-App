import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
}
export function PrivateRoute({ children}: PrivateRouteProps) {

  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
}


interface StudentProtectedRoute {
  children: ReactNode;
}
export function StudentProtectedRoute({ children}: StudentProtectedRoute) {
  const location = useLocation();
  const { user } = useAuth();
  
  if(user && user.role !== 'STUDENT') return <Navigate to="/instructor" />;

  if (user && user.role === 'STUDENT') {
    if(location.pathname.includes('login')) return <Navigate to="/" />;
    if(location.pathname.includes('signup')) return <Navigate to="/" />;
  } 
  
  return <>{children}</>;
}


interface InstructorProtectedRoute {
  children: ReactNode;
}
export function InstructorProtectedRoute({ children}: InstructorProtectedRoute) {
  const location = useLocation();
  const { user } = useAuth();
  
  if(user && user.role !== 'INSTRUCTOR') return <Navigate to="/" />;

  if (user && user.role === 'INSTRUCTOR') {
    if(location.pathname.includes('login')) return <Navigate to="/instructor" />;
    if(location.pathname.includes('signup')) return <Navigate to="/instructor" />;
  } 
  
  return <>{children}</>;
}