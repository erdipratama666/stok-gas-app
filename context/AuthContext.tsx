'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const savedUser = localStorage.getItem("user");

      setIsLoggedIn(savedIsLoggedIn);
      if (savedUser) setUser(JSON.parse(savedUser));

      setIsLoading(false);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("isLoggedIn", String(isLoggedIn));
      if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.removeItem("user");
    }
  }, [isLoggedIn, user, isLoading]);

  // FIXED LOGIN (ADMIN ONLY)
  const login = (email: string, password: string): boolean => {
    if (email === "admin@gmail.com" && password === "admin10") {
      const adminUser: User = {
        name: "Administrator",
        email,
        role: "admin",
      };

      setIsLoggedIn(true);
      setUser(adminUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
