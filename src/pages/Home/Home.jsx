import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';

const Home = () => {
  useEffect(() => {
    // Testar se as variáveis de ambiente são acessíveis
    console.log('Testando variáveis de ambiente:');
    console.log('TMDB Key exists:', !!import.meta.env.VITE_TMDB_API_KEY);
    console.log('Firebase Key exists:', !!import.meta.env.VITE_FIREBASE_API_KEY);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ color: 'white', textAlign: 'center' }}>
        Home - Teste Environment Variables
      </Typography>
    </Container>
  );
};

export default Home;