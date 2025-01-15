import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { LoginFormData, RegisterFormData } from '@/types/auth-form';
import { LoginRequest, LogoutRequest, ProfileRequest, SignupRequest } from '@/services';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (registerData: RegisterFormData) => Promise<void>;
  login: (loginData: LoginFormData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
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
      console.log(error);
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
      const data = await LogoutRequest();
    } catch (error) {
      console.log(error);
      setLoading(false);
      throw error;
    }
    setLoading(false);
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="h-screen flex flex-col justify-center items-center space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      ) : children}
    </AuthContext.Provider>
  );
};