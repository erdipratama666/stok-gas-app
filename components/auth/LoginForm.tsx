'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  role?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const savedUser = localStorage.getItem('user');
      
      setIsLoggedIn(savedIsLoggedIn);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      
      setIsLoading(false); 
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      localStorage.setItem('isLoggedIn', String(isLoggedIn));
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
  }, [isLoggedIn, user, isLoading]);

  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin') {
      const userData: User = { 
        username,
        role: 'admin' 
      };
      
      setIsLoggedIn(true);
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
    }
  };

  const value: AuthContextType = {
    isLoggedIn,
    user,
    login,
    logout,
    isLoading, 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};