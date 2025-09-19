import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Rating,
  Chip,
  Button,
  Grid,
  Paper,
  Avatar,
  IconButton,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayIcon,
  DateRange as DateIcon,
  Schedule as ScheduleIcon,
  Language as LanguageIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

import { movieApi, getImageUrl, getBackdropUrl, formatDate, formatRuntime } from '../../services/tmdbApi';
import MovieCard from '../../components/MovieCard/MovieCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovieDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await movieApi.getMovieDetails(id);
        setMovie(response.data);
      } catch (err) {
        console.error('Error loading movie details:', err);
        setError('Erro ao carregar detalhes do filme. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMovieDetails();
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Carregando detalhes do filme..." fullScreen />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="outlined"
        >
          Voltar
        </Button>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">Filme não encontrado.</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Voltar
        </Button>
      </Container>
    );
  }

  // Get director from crew
  const director = movie.credits?.crew?.find(person => person.job === 'Director');

  // Get main cast (first 10)
  const mainCast = movie.credits?.cast?.slice(0, 10) || [];

  // Get trailer
  const trailer = movie.videos?.results?.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section with Backdrop */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '50vh', md: '70vh' },
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${getBackdropUrl(movie.backdrop_path)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <Container maxWidth="lg" sx={{ pb: 4 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              position: 'absolute',
              top: 20,
              left: 20,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Grid container spacing={4} alignItems="flex-end">
            {/* Movie Poster */}
            <Grid item xs={12} sm={4} md={3}>
              <Paper
                elevation={8}
                sx={{
                  overflow: 'hidden',
                  borderRadius: 2,
                  height: { xs: 300, sm: 400 },
                }}
              >
                <img
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.target.src = '/placeholder-movie.jpg';
                  }}
                />
              </Paper>
            </Grid>

            {/* Movie Info */}
            <Grid item xs={12} sm={8} md={9}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  mb: 2,
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                {movie.title}
              </Typography>

              {movie.tagline && (
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    fontStyle: 'italic',
                    mb: 2,
                  }}
                >
                  "{movie.tagline}"
                </Typography>
              )}

              {/* Rating and Basic Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                {movie.vote_average > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating
                      value={movie.vote_average / 2}
                      precision={0.1}
                      readOnly
                      sx={{ color: '#ffd700' }}
                    />
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      {movie.vote_average.toFixed(1)}
                    </Typography>
                  </Box>
                )}

                {movie.release_date && (
                  <Chip
                    icon={<DateIcon />}
                    label={formatDate(movie.release_date)}
                    sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white' }}
                  />
                )}

                {movie.runtime && (
                  <Chip
                    icon={<ScheduleIcon />}
                    label={formatRuntime(movie.runtime)}
                    sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white' }}
                  />
                )}
              </Box>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {movie.genres.map((genre) => (
                    <Chip
                      key={genre.id}
                      label={genre.name}
                      variant="outlined"
                      sx={{
                        borderColor: 'primary.main',
                        color: 'white',
                        bgcolor: 'rgba(229, 9, 20, 0.2)',
                      }}
                    />
                  ))}
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                {trailer && (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayIcon />}
                    sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')}
                  >
                    Assistir Trailer
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Details Section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Left Column - Main Info */}
          <Grid item xs={12} md={8}>
            {/* Overview */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="600">
                Sinopse
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                {movie.overview || 'Sinopse não disponível.'}
              </Typography>
            </Paper>

            {/* Cast */}
            {mainCast.length > 0 && (
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight="600">
                  Elenco Principal
                </Typography>
                <Grid container spacing={2}>
                  {mainCast.map((actor) => (
                    <Grid item xs={6} sm={4} md={3} key={actor.id}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Avatar
                          src={getImageUrl(actor.profile_path, 'w185')}
                          sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
                        />
                        <Typography variant="body2" fontWeight="600">
                          {actor.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {actor.character}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}
          </Grid>

          {/* Right Column - Additional Info */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="600">
                Informações Adicionais
              </Typography>
              
              {director && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Diretor
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {director.name}
                  </Typography>
                </Box>
              )}

              {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Idiomas
                  </Typography>
                  <Typography variant="body1">
                    {movie.spoken_languages.map(lang => lang.english_name).join(', ')}
                  </Typography>
                </Box>
              )}

              {movie.budget > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Orçamento
                  </Typography>
                  <Typography variant="body1">
                    ${movie.budget.toLocaleString()}
                  </Typography>
                </Box>
              )}

              {movie.revenue > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Bilheteria
                  </Typography>
                  <Typography variant="body1">
                    ${movie.revenue.toLocaleString()}
                  </Typography>
                </Box>
              )}

              {movie.production_companies && movie.production_companies.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Produtoras
                  </Typography>
                  <Typography variant="body1">
                    {movie.production_companies.map(company => company.name).join(', ')}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Similar Movies */}
        {movie.similar && movie.similar.results.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="600">
              Filmes Similares
            </Typography>
            <Grid container spacing={3}>
              {movie.similar.results.slice(0, 4).map((similarMovie) => (
                <Grid item xs={12} sm={6} md={3} key={similarMovie.id}>
                  <MovieCard movie={similarMovie} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MovieDetails;