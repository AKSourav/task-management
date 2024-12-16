// src/components/ProtectedRoute.tsx

import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
          return;
        }

        // Optional: Verify token with your backend
        // const response = await fetch('/api/verify-token', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const isValid = await response.json();

        setAuthState({
          isAuthenticated: true, // or isValid if using backend verification
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: 'Authentication failed',
        });
      }
    };

    verifyToken();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  return { ...authState, logout };
};

const ProtectedRoute = ({ 
  children, 
  redirectPath = '/login' 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Save the attempted URL for redirecting after login
      navigate(redirectPath, { 
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [isAuthenticated, isLoading, navigate, redirectPath, location]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;