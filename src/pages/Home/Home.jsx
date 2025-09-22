import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Alert,
  Card,
  CardMedia,
  CardContent,
  Rating,
} from '@mui/material';
import { movieApi, getImageUrl } from '../../services/tmdbApi';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const response = await movieApi.getPopularMovies();
      
      if (response && response.data && response.data.results) {
        setMovies(response.data.results.slice(0, 12)); // Apenas 12 filmes
      }
    } catch (err) {
      console.error('Error loading movies:', err);
      setError('Erro ao carregar filmes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ color: 'white' }}>
          Carregando filmes...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 4,
          color: 'primary.main',
        }}
      >
        SylkFlix - Filmes Populares
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
              <CardMedia
                component="img"
                height="300"
                image={getImageUrl(movie.poster_path)}
                alt={movie.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                  {movie.title}
                </Typography>
                <Rating
                  value={movie.vote_average / 2}
                  precision={0.1}
                  size="small"
                  readOnly
                />
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  {movie.overview ? movie.overview.substring(0, 100) + '...' : ''}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;