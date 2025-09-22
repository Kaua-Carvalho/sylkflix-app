import React from 'react';
import { Container, Typography } from '@mui/material';
import axios from 'axios';

const Home = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ color: 'white', textAlign: 'center' }}>
        Home - Com Axios Import
      </Typography>
    </Container>
  );
};

export default Home;