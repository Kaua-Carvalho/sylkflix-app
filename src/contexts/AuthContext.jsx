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

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          // Tenta fazer uma requisição para validar o token
          await api.get('/assistidos');
          setUser(JSON.parse(storedUser));
        } catch (error) {
          // Token inválido ou usuário não existe mais
          localStorage.clear();
          setUser(null);
        }
      }
      
      setLoading(false);
    };
    
    validateToken();
  }, []);

  // Register user
  const register = async (nome, email, senha) => {
    try {
      const response = await authApi.register(nome, email, senha);
      const { token, id, nome: userName, email: userEmail } = response.data;
      
      // Salvar token e usuário
      localStorage.setItem('token', token);
      const userData = { id, displayName: userName, email: userEmail, profilePicture: 'Profile0' };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Login user
const login = async (email, senha) => {
  try {
    const response = await authApi.login(email, senha);
    const { token, id, nome: userName, email: userEmail, profilePicture } = response.data;

    // Se o backend já retornar profilePicture, usa; senão fallback para Profile0
    const userData = { id, displayName: userName, email: userEmail, profilePicture: profilePicture || 'Profile0' };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return response;
  } catch (error) {
    throw error;
  }
};

  // Logout user
  const logout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  // ✅ NOVO: Atualizar dados do usuário no contexto
  const updateUserData = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUserData, // ✅ Adicionar ao contexto
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};