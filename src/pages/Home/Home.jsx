import React from 'react';
import { Container, Typography } from '@mui/material';
// import { movieApi } from '../../services/tmdbApi'; // COMENTADO

const Home = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ color: 'white', textAlign: 'center' }}>
        Home - Sem usar movieApi
      </Typography>
    </Container>
  );
};

export default Home;