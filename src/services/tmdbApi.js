import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'fc90fc076f265b3a47d3078527ac9850';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR',
  },
});

tmdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const movieApi = {
  getPopularMovies: (page = 1) => {
    return tmdbApi.get('/movie/popular', {
      params: { page }
    });
  },

  getTrendingMovies: (timeWindow = 'day') => {
    return tmdbApi.get(`/trending/movie/${timeWindow}`);
  },

  getMoviesByGenre: (genreId, page = 1) => {
    return tmdbApi.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page
      }
    });
  },

  getMovieDetails: (movieId) => {
    return tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos,credits,similar'
      }
    });
  },

  searchMovies: (query, page = 1) => {
    return tmdbApi.get('/search/movie', {
      params: {
        query,
        page
      }
    });
  },

  getGenres: () => {
    return tmdbApi.get('/genre/movie/list');
  },

  getTopRatedMovies: (page = 1) => {
    return tmdbApi.get('/movie/top_rated', {
      params: { page }
    });
  },

  getUpcomingMovies: (page = 1) => {
    return tmdbApi.get('/movie/upcoming', {
      params: { page }
    });
  },

  getNowPlayingMovies: (page = 1) => {
    return tmdbApi.get('/movie/now_playing', {
      params: { page }
    });
  }
};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return '/placeholder-movie.jpg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path, size = 'w1280') => {
  if (!path) return '/placeholder-backdrop.jpg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Data não disponível';
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

export const formatRuntime = (minutes) => {
  if (!minutes) return 'Duração não disponível';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  return `${hours}h ${mins}min`;
};

export default tmdbApi;