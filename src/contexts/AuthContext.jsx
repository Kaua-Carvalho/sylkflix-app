import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/apiService';
import api from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          await api.get('/assistidos');
          setUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.clear();
          setUser(null);
        }
      }
      
      setLoading(false);
    };
    
    validateToken();
  }, []);

  const register = async (nome, email, senha) => {
    try {
      const response = await authApi.register(nome, email, senha);
      const { token, id, nome: userName, email: userEmail } = response.data;
      
      localStorage.setItem('token', token);
      const userData = { id, displayName: userName, email: userEmail, profilePicture: 'Profile0' };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

const login = async (email, senha) => {
  try {
    const response = await authApi.login(email, senha);
    const { token, id, nome: userName, email: userEmail, profilePicture } = response.data;

    const userData = { id, displayName: userName, email: userEmail, profilePicture: profilePicture || 'Profile0' };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return response;
  } catch (error) {
    throw error;
  }
};

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const updateUserData = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};