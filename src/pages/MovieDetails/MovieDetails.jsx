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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayIcon,
  DateRange as DateIcon,
  Schedule as ScheduleIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
} from '@mui/icons-material';

import { movieApi, getImageUrl, getBackdropUrl, formatDate, formatRuntime } from '../../services/tmdbApi';
import { assistidosApi } from '../../services/apiService';
import { useAuth } from '../../contexts/AuthContext';
import MovieCard from '../../components/MovieCard/MovieCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAssistido, setIsAssistido] = useState(false);
  const [assistidoId, setAssistidoId] = useState(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [avaliacao, setAvaliacao] = useState(0);
  const [loadingAssistido, setLoadingAssistido] = useState(false);

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

  useEffect(() => {
    const checkAssistido = async () => {
      if (user && movie) {
        try {
          const response = await assistidosApi.isAssistido(movie.id);
          setIsAssistido(response.data.isAssistido);
          if (response.data.assistidoId) {
            setAssistidoId(response.data.assistidoId);
          }
        } catch (error) {
          console.error('Erro ao verificar assistido:', error);
        }
      }
    };

    checkAssistido();
  }, [user, movie]);

  const handleAddAssistido = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowRatingDialog(true);
  };

  const handleConfirmAssistido = async () => {
    if (avaliacao === 0) {
      return;
    }

    setLoadingAssistido(true);
    try {
      const filmeData = {
        tmdbId: movie.id,
        titulo: movie.title,
        posterPath: movie.poster_path,
        avaliacao: avaliacao,
      };

      const response = await assistidosApi.addAssistido(filmeData);
      setIsAssistido(true);
      setAssistidoId(response.data.id);
      
      setTimeout(() => {
        setShowRatingDialog(false);
        setAvaliacao(0);
      }, 300);
    } catch (error) {
      console.error('Erro ao adicionar assistido:', error);
    } finally {
      setLoadingAssistido(false);
    }
  };

  const handleRemoveAssistido = async () => {
    if (!assistidoId) return;

    setLoadingAssistido(true);
    try {
      await assistidosApi.removeAssistido(assistidoId);
      setIsAssistido(false);
      setAssistidoId(null);
    } catch (error) {
      console.error('Erro ao remover assistido:', error);
    } finally {
      setLoadingAssistido(false);
    }
  };

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

  const director = movie.credits?.crew?.find(person => person.job === 'Director');
  const mainCast = movie.credits?.cast?.slice(0, 10) || [];
  const trailer = movie.videos?.results?.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <Box sx={{ minHeight: '100vh' }}>
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

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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

                {user && (
                  isAssistido ? (
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<FavoriteIcon />}
                      onClick={handleRemoveAssistido}
                      disabled={loadingAssistido}
                      sx={{
                        borderColor: 'error.main',
                        color: 'error.main',
                        '&:hover': {
                          borderColor: 'error.dark',
                          bgcolor: 'rgba(244, 67, 54, 0.1)',
                        },
                      }}
                    >
                      {loadingAssistido ? 'Removendo...' : 'Remover dos Assistidos'}
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<FavoriteBorderIcon />}
                      onClick={handleAddAssistido}
                      disabled={loadingAssistido}
                      sx={{
                        borderColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'primary.light',
                          bgcolor: 'rgba(229, 9, 20, 0.1)',
                        },
                      }}
                    >
                      Adicionar aos Assistidos
                    </Button>
                  )
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Dialog 
  open={showRatingDialog} 
  onClose={() => setShowRatingDialog(false)}
  TransitionProps={{
    timeout: 300,
  }}
  PaperProps={{
    sx: {
      borderRadius: 3,
      minWidth: 450,
      maxWidth: 450,
      background: 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)',
    }
  }}
>
  <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
    <Typography variant="h5" fontWeight="600">
      Avaliar Filme
    </Typography>
  </DialogTitle>
  <DialogContent>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
      <Box
        component="img"
        src={getImageUrl(movie.poster_path, 'w200')}
        alt={movie.title}
        sx={{
          width: 120,
          height: 180,
          borderRadius: 2,
          mb: 2,
          boxShadow: 3,
        }}
      />
      
      <Typography 
        variant="h6" 
        gutterBottom 
        textAlign="center" 
        sx={{ 
          mb: 2,
          px: 2,
          minHeight: 60, 
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2, 
          WebkitBoxOrient: 'vertical',
        }}
      >
        {movie.title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Dê sua avaliação:
      </Typography>
      
      <Rating
        value={avaliacao}
        onChange={(event, newValue) => setAvaliacao(newValue)}
        size="large"
        max={5}
        icon={<StarIcon fontSize="inherit" />}
        emptyIcon={<StarIcon fontSize="inherit" />}
        sx={{
          fontSize: '3rem',
          '& .MuiRating-iconFilled': {
            color: '#ffd700',
          },
        }}
      />
      
    </Box>
  </DialogContent>
  <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
    <Button 
      onClick={() => {
        setShowRatingDialog(false);
        setAvaliacao(0);
      }}
      variant="outlined"
      fullWidth
      sx={{
        borderColor: 'rgba(255, 255, 255, 0.3)',
        color: 'text.primary',
        '&:hover': {
          borderColor: 'rgba(255, 255, 255, 0.5)',
          bgcolor: 'rgba(255, 255, 255, 0.05)',
        },
      }}
    >
      Cancelar
    </Button>
    <Button 
      onClick={handleConfirmAssistido} 
      disabled={avaliacao === 0 || loadingAssistido}
      variant="contained"
      fullWidth
      sx={{
        background: avaliacao === 0 || loadingAssistido 
          ? 'linear-gradient(45deg, #3a3a3a, #4a4a4a)' 
          : 'linear-gradient(45deg, #e50914, #f40612)',
        color: avaliacao === 0 || loadingAssistido 
          ? 'rgba(255, 255, 255, 0.3)' 
          : 'white',
        cursor: avaliacao === 0 || loadingAssistido ? 'not-allowed' : 'pointer',
        '&:hover': {
          background: avaliacao === 0 || loadingAssistido
            ? 'linear-gradient(45deg, #3a3a3a, #4a4a4a)' 
            : 'linear-gradient(45deg, #b8070f, #d8050e)',
        },
        '&.Mui-disabled': {
          background: 'linear-gradient(45deg, #3a3a3a, #4a4a4a)',
          color: 'rgba(255, 255, 255, 0.3)',
        },
      }}
    >
      {loadingAssistido ? 'Adicionando...' : 'Adicionar aos Assistidos'}
    </Button>
  </DialogActions>
</Dialog>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="600">
                Sinopse
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                {movie.overview || 'Sinopse não disponível.'}
              </Typography>
            </Paper>

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