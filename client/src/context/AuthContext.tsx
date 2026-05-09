/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Define Types
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

// 2. Initialize Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
 // 1. Explicitly type the state so it knows it can hold a string OR null
const [user, setUser] = useState<User | null>(null);
const [token, setToken] = useState<string | null>(null); // THIS IS THE KEY
const [isLoading, setIsLoading] = useState<boolean>(true);

useEffect(() => {
    const initializeAuth = () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      // 1. Explicitly check that both values exist
      if (savedToken && savedUser) {
        try {
          // 2. Parse the user first
          const parsedUser = JSON.parse(savedUser) as User;
          
          // 3. Update state (TypeScript is happy because savedToken is a string here)
          setToken(savedToken);
          setUser(parsedUser);
        } catch (error) {
          console.error("Auth sync error:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);
  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. The Hook (Fixed Syntax)
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};