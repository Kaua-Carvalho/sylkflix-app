import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', color: 'white' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Home Simplificada - Funcionando
        </Typography>
        <Typography variant="h6">
          Página Home carregada sem chamadas de API
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;