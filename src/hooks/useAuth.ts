import { useState, useEffect } from 'react';
import { User } from '@/types/iris';
import { useLocalStorage } from './useLocalStorage';

export const useAuth = () => {
  const [token, setToken] = useLocalStorage<string | null>('iris_token', null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync user state with token changes
  useEffect(() => {
    const checkAuth = () => {
      if (token) {
        setUser({
          id: '1',
          username: 'admin',
          email: 'admin@iris.com',
          isAuthenticated: true
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simular autenticação
    if (username === 'admin' && password === 'admin') {
      setToken('mock_token');
      setIsLoading(false);
      return { success: true };
    }
    
    setIsLoading(false);
    return { success: false, error: 'Credenciais inválidas' };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user?.isAuthenticated
  };
};