import React from 'react';
import { Container, Typography } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ color: 'white', textAlign: 'center' }}>
        Home - Sem Imports Externos
      </Typography>
    </Container>
  );
};

export default Home;