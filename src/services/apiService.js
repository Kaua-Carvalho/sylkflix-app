import axios from 'axios';

// URL base da API - LOCAL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===================================
// AUTH API
// ===================================
export const authApi = {
  register: (nome, email, senha) => {
    return api.post('/auth/register', { nome, email, senha });
  },
  
  login: (email, senha) => {
    return api.post('/auth/login', { email, senha });
  },

  // ✅ NOVO: Atualizar nome
  updateNome: (nome) => {
    return api.put('/auth/update-nome', { nome });
  },

  // ✅ NOVO: Deletar conta
  deleteAccount: () => {
    return api.delete('/auth/delete-account');
  },

  updateProfilePicture : (profilePicture) => {
    const token = localStorage.getItem('token');
    return api.put(
      '/auth/profile-picture', // URL do backend
      { profilePicture },             // corpo JSON correto
     { headers: { Authorization: `Bearer ${token}` } } // token JWT
    );
  },
};

// ===================================
// FAVORITOS API
// ===================================
export const assistidosApi = {
  // Adicionar filme aos assistidos
  addAssistido: (filmeData) => {
    return api.post('/assistidos', filmeData);
  },
  
  // Listar todos os assistidos
  getAllAssistidos: () => {
    return api.get('/assistidos');
  },
  
  // Verificar se filme é assistido
  isAssistido: (tmdbId) => {
    return api.get(`/assistidos/check/${tmdbId}`);
  },
  
  // Atualizar avaliação
  updateAvaliacao: (id, avaliacao) => {
    return api.put(`/assistidos/${id}/avaliacao`, { avaliacao });
  },
  
  // Remover assistido
  removeAssistido: (id) => {
    return api.delete(`/assistidos/${id}`);
  },

  
};


export default api;