import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { movieApi } from '../../services/tmdbApi';

const Home = () => {
  const handleClick = async () => {
    try {
      console.log('Testando API...');
      const response = await movieApi.getGenres();
      console.log('Sucesso:', response);
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ color: 'white', textAlign: 'center', mb: 3 }}>
        Home - Teste Manual
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={handleClick}
        sx={{ display: 'block', mx: 'auto' }}
      >
        Testar API
      </Button>
    </Container>
  );
};

export default Home;