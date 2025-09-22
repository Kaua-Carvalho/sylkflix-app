import React from 'react';
import { Container, Typography } from '@mui/material';
import { movieApi } from '../../services/tmdbApi';

const Home = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ color: 'white', textAlign: 'center' }}>
        Home - Com tmdbApi Import (Corrigido)
      </Typography>
    </Container>
  );
};

export default Home;