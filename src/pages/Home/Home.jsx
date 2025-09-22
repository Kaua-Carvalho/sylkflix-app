import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { movieApi } from '../../services/tmdbApi';

const Home = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('useEffect executando...');
    
    const loadData = async () => {
      try {
        console.log('Chamando movieApi.getGenres()...');
        const response = await movieApi.getGenres();
        console.log('Resposta recebida:', response);
        setData(response);
      } catch (err) {
        console.error('Erro:', err);
        setData({ error: err.message });
      }
    };

    loadData();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ color: 'white', textAlign: 'center' }}>
        Home - Teste useEffect
      </Typography>
      
      <Typography sx={{ color: 'white', textAlign: 'center', mt: 2 }}>
        Data: {data ? 'Carregado' : 'Carregando...'}
      </Typography>
    </Container>
  );
};

export default Home;