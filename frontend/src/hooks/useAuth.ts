import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import { LoginFormData, RegisterFormData } from '../types/auth';


export const useAuthHooks = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const { login, signup } = useAuth();

  const handleLogin = async ({ email, password, role }: LoginFormData) => {
    try {
      await login(email, password, role);
      navigate(role === 'admin' ? '/admin' : '/');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleRegister = async ({ name, email, password, role }: RegisterFormData) => {
    try {
      await signup(name, email, password, role);
      navigate(role === 'admin' ? '/admin' : '/');
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return { error, handleLogin, handleRegister };
};