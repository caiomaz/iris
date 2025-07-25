import { useState, useEffect } from 'react';
import { User } from '@/types/iris';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular verificação de autenticação
    const checkAuth = () => {
      const token = localStorage.getItem('iris_token');
      if (token) {
        setUser({
          id: '1',
          username: 'admin',
          email: 'admin@iris.com',
          isAuthenticated: true
        });
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simular autenticação
    if (username === 'admin' && password === 'admin') {
      const userData = {
        id: '1',
        username: 'admin',
        email: 'admin@iris.com',
        isAuthenticated: true
      };
      
      localStorage.setItem('iris_token', 'mock_token');
      setUser(userData);
      setIsLoading(false);
      return { success: true };
    }
    
    setIsLoading(false);
    return { success: false, error: 'Credenciais inválidas' };
  };

  const logout = () => {
    localStorage.removeItem('iris_token');
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