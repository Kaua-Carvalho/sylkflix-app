import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import { movieApi } from '../../services/tmdbApi';

const Home = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        console.log('Tentando carregar gêneros...');
        const response = await movieApi.getGenres();
        console.log('Resposta da API:', response);
        
        if (response && response.data && response.data.genres) {
          setGenres(response.data.genres);
          console.log('Gêneros carregados:', response.data.genres.length);
        }
      } catch (err) {
        console.error('Erro ao carregar gêneros:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ color: 'white', textAlign: 'center' }}>
          Carregando...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ color: 'white', textAlign: 'center', mb: 3 }}>
        Home - Teste API
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Erro: {error}
        </Alert>
      )}

      <Box sx={{ color: 'white' }}>
        <Typography variant="h5" gutterBottom>
          Gêneros carregados: {genres.length}
        </Typography>
        
        {genres.slice(0, 5).map(genre => (
          <Typography key={genre.id} variant="body1">
            - {genre.name}
          </Typography>
        ))}
      </Box>
    </Container>
  );
};

export default Home;