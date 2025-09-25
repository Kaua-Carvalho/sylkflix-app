import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Pagination,
  Chip,
  Paper,
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  Star as StarIcon,
  PlayArrow as PlayIcon,
  Movie as MovieIcon,
} from '@mui/icons-material';

import { movieApi } from '../../services/tmdbApi';
import MovieCard from '../../components/MovieCard/MovieCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Header from '../../components/Header/Header';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const tabOptions = [
    { label: 'Populares', value: 'popular', icon: <TrendingIcon /> },
    { label: 'Em Alta', value: 'trending', icon: <PlayIcon /> },
    { label: 'Mais Bem Avaliados', value: 'top_rated', icon: <StarIcon /> },
    { label: 'Lançamentos', value: 'upcoming', icon: <MovieIcon /> },
  ];

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const response = await movieApi.getGenres();
        setGenres(response.data.genres);
      } catch (err) {
        console.error('Error loading genres:', err);
      }
    };

    loadGenres();
  }, []);

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;

        if (searchQuery) {
          response = await movieApi.searchMovies(searchQuery, currentPage);
        } else if (selectedGenre) {
          response = await movieApi.getMoviesByGenre(selectedGenre, currentPage);
        } else {
          const currentTabValue = tabOptions[currentTab].value;
          
          switch (currentTabValue) {
            case 'popular':
              response = await movieApi.getPopularMovies(currentPage);
              break;
            case 'trending':
              response = await movieApi.getTrendingMovies();
              break;
            case 'top_rated':
              response = await movieApi.getTopRatedMovies(currentPage);
              break;
            case 'upcoming':
              response = await movieApi.getUpcomingMovies(currentPage);
              break;
            default:
              response = await movieApi.getPopularMovies(currentPage);
          }
        }

        setMovies(response.data.results);
        setTotalPages(Math.min(response.data.total_pages, 500));
      } catch (err) {
        console.error('Error loading movies:', err);
        setError('Erro ao carregar filmes. Tente novamente.');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [currentTab, selectedGenre, currentPage, searchQuery]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setSelectedGenre('');
    setCurrentPage(1);
    setSearchQuery('');
    setSearchParams({});
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
    setCurrentPage(1);
    setSearchQuery('');
    setSearchParams({});
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedGenre('');
    setCurrentPage(1);
    
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  const getSectionTitle = () => {
    if (searchQuery) {
      return `Resultados para "${searchQuery}"`;
    }
    if (selectedGenre) {
      const genre = genres.find(g => g.id === selectedGenre);
      return `Filmes de ${genre?.name}`;
    }
    return tabOptions[currentTab].label;
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 4,
            background: 'linear-gradient(45deg, #e50914, #f40612)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Descubra Seus Próximos Filmes Favoritos
        </Typography>

        <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Explorar Filmes
            </Typography>
            
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 2 }}
            >
              {tabOptions.map((tab, index) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  icon={tab.icon}
                  iconPosition="start"
                  disabled={searchQuery || selectedGenre}
                />
              ))}
            </Tabs>

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Filtrar por Gênero</InputLabel>
              <Select
                value={selectedGenre}
                label="Filtrar por Gênero"
                onChange={handleGenreChange}
                disabled={searchQuery}
              >
                <MenuItem value="">
                  <em>Todos os Gêneros</em>
                </MenuItem>
                {genres.map((genre) => (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {(searchQuery || selectedGenre) && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {searchQuery && (
                <Chip
                  label={`Busca: ${searchQuery}`}
                  onDelete={() => handleSearch('')}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedGenre && (
                <Chip
                  label={`Gênero: ${genres.find(g => g.id === selectedGenre)?.name}`}
                  onDelete={() => setSelectedGenre('')}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          )}
        </Paper>

        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          {getSectionTitle()}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <LoadingSpinner message="Carregando filmes..." />
        ) : (
          <>
            {movies.length > 0 ? (
              <>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {movies.map((movie) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={movie.id}>
                      <MovieCard movie={movie} genres={genres} />
                    </Grid>
                  ))}
                </Grid>

                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                    />
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <MovieIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Nenhum filme encontrado
                </Typography>
                <Typography color="text.secondary">
                  Tente ajustar seus filtros ou fazer uma nova busca.
                </Typography>
              </Box>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Home;