import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import axios from 'axios';

const Home = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testando API diretamente...');
        
        const API_KEY = 'fc90fc076f265b3a47d3078527ac9850';
        const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=pt-BR`);
        
        console.log('Resposta da API:', response.data);
        setData(response.data);
      } catch (err) {
        console.error('Erro na API:', err);
        setError(err.message);
      }
    };

    testApi();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ color: 'white', textAlign: 'center', mb: 3 }}>
        Home - Teste Direto API
      </Typography>
      
      {error && (
        <Typography sx={{ color: 'red' }}>Erro: {error}</Typography>
      )}

      {data && (
        <Box sx={{ color: 'white' }}>
          <Typography variant="h5">
            Gêneros: {data.genres?.length || 0}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Home;