import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (nome, email, senha) => {
    return api.post('/auth/register', { nome, email, senha });
  },
  
  login: (email, senha) => {
    return api.post('/auth/login', { email, senha });
  },

  updateNome: (nome) => {
    return api.put('/auth/update-nome', { nome });
  },

  deleteAccount: () => {
    return api.delete('/auth/delete-account');
  },

  updateProfilePicture : (profilePicture) => {
    const token = localStorage.getItem('token');
    return api.put(
      '/auth/profile-picture',
      { profilePicture },
     { headers: { Authorization: `Bearer ${token}` } }
    );
  },
};

export const assistidosApi = {
  addAssistido: (filmeData) => {
    return api.post('/assistidos', filmeData);
  },
  
  getAllAssistidos: () => {
    return api.get('/assistidos');
  },
  
  isAssistido: (tmdbId) => {
    return api.get(`/assistidos/check/${tmdbId}`);
  },
  
  updateAvaliacao: (id, avaliacao) => {
    return api.put(`/assistidos/${id}/avaliacao`, { avaliacao });
  },
  
  removeAssistido: (id) => {
    return api.delete(`/assistidos/${id}`);
  },

  
};


export default api;