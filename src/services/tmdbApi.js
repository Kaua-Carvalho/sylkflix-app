import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Debug temporário - remover depois
console.log('TMDB API KEY:', API_KEY ? 'Found' : 'Missing');
console.log('Firebase API KEY:', import.meta.env.VITE_FIREBASE_API_KEY ? 'Found' : 'Missing');

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR',
  },
});