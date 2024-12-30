import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import API from '../api/axios';
import { User } from '../types';
import { AxiosError } from 'axios';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string, role: "user" | "admin") => Promise<void>;
  signup: (name: string, email: string, password: string, role: "user" | "admin") => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get('/user/profile');
        setUser(response.data.user);
      } catch (error) {
        logout();
      }
    };
    
    const fetchAdmin = async () => {
      try {
        const response = await API.get('/admin/profile');
        setUser(response.data.user);
        setIsAdmin(true);
      } catch (error) {
        logout();
      }
    };

    const token = localStorage.getItem('token');
    const isAdminToken = localStorage.getItem('isAdmin');
    if (token && isAdminToken) {
      fetchAdmin();
    } else if (token) {
      fetchUser();
    }

  }, []);

  const signup = async (name: string, email: string, password: string, role: "user" | "admin") => {
    try {
      setLoading(true);
      if (role === "admin") {
        const response = await API.post('/admin/signup', { name, email, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isAdmin', 'true');
        setUser(response.data.user);
        setIsAdmin(true);
      } else {
        const response = await API.post('/user/signup', { name, email, password });
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
      }
    } catch (error) {
      const errData = (error as AxiosError).response?.data as { message: string };
      console.error('Error logging in:', errData);
      setLoading(false);
      throw errData;
    }
    setLoading(false);
  }

  const login = async (email: string, password: string, role: "user" | "admin") => {
    try {
      setLoading(true);
      if(role === "admin") {
        const response = await API.post('/admin/signin', { email, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isAdmin', 'true');
        setUser(response.data.user);
        setIsAdmin(true);
      } else {
        const response = await API.post('/user/signin', { email, password });
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
      }
    } catch (error) {
      const errData = (error as AxiosError).response?.data as { message: string };
      console.error('Error logging in:', errData);
      setLoading(false);
      throw errData;
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setUser(null);
    setIsAdmin(false);
    setLoading(false);
  }

  // const checkUserRole = async (userId?: string) => {
  //   if (!userId) {
  //     setIsAdmin(false);
  //     return;
  //   }

  //   const { data, error } = await supabase
  //     .from('profiles')
  //     .select('role')
  //     .eq('id', userId)
  //     .single();

  //   if (!error && data) {
  //     setIsAdmin(data.role === 'admin');
  //   }
  //   setLoading(false);
  // };

  const value = {
    user,
    isAdmin,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {/* {!loading && children} */}
      {children}
    </AuthContext.Provider>
  );
};