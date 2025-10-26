'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  role?: string;
}

interface RegisteredUser extends User {
  password: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);

  // ✅ Check localStorage saat mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const savedUser = localStorage.getItem('user');
      const savedRegisteredUsers = localStorage.getItem('registeredUsers');
      
      setIsLoggedIn(savedIsLoggedIn);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      if (savedRegisteredUsers) {
        setRegisteredUsers(JSON.parse(savedRegisteredUsers));
      }
      
      setIsLoading(false);
    }
  }, []);

  // ✅ Save ke localStorage
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

  // ✅ Save registered users ke localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }
  }, [registeredUsers, isLoading]);

  const register = (name: string, email: string, password: string): boolean => {
    console.log('📝 Register attempt:', { name, email });
    
    // Cek apakah email sudah terdaftar
    const existingUser = registeredUsers.find(u => u.email === email);
    if (existingUser) {
      console.log('❌ Email already registered');
      return false;
    }

    // Tambah user baru
    const newUser: RegisteredUser = {
      name,
      email,
      password,
      role: 'user'
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    console.log('✅ Registration success!');
    return true;
  };

  const login = (email: string, password: string): boolean => {
    console.log('🔐 Login attempt:', { email });
    
    // Cari user di daftar registered users
    const foundUser = registeredUsers.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData: User = {
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      };
      
      setIsLoggedIn(true);
      setUser(userData);
      console.log('✅ Login success!');
      return true;
    }
    
    console.log('❌ Login failed - Invalid credentials');
    return false;
  };

  const logout = () => {
    console.log('🚪 Logout');
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
    register,
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