import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserType } from '../types';
import { LoginFormData, RegisterFormData } from '@/types/auth-form';
import { LoginRequest, ProfileRequest, SignupRequest } from '@/services';
import { LoginSkeleton } from '@/components/LoadingSkeleton';

interface AuthContextType {
  user: UserType | null;
  loading: boolean;
  signup: (registerData: RegisterFormData) => Promise<void>;
  login: (loginData: LoginFormData) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  refreshUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await ProfileRequest();
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signup = async (registerData: RegisterFormData) => {
    try {
      setLoading(true);
      const data = await SignupRequest(registerData);
      sessionStorage.setItem('token', data.token);
      setUser(data.user);
    }
    catch (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  }

  const login = async (loginData: LoginFormData) => {
    try {
      setLoading(true);
      const data = await LoginRequest(loginData);
      sessionStorage.setItem('token', data.token);
      setUser(data.user);
    } catch (error) {
      console.log(error);
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  const logout = async () => {
    try {
      setLoading(true);
      sessionStorage.removeItem('token');
      setUser(null);
      // const data = await LogoutRequest();
    } catch (error) {
      console.log(error);
      setLoading(false);
      throw error;
    }
    setLoading(false);
  }

  const refreshUser = () => {
    fetchUser();
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <LoginSkeleton />
      ) : children}
    </AuthContext.Provider>
  );
};