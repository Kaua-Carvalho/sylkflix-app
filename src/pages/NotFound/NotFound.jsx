import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
} from '@mui/material';
import {
  Home as HomeIcon,
  Movie as MovieIcon,
} from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '60vh',
          justifyContent: 'center',
        }}
      >
        <MovieIcon
          sx={{
            fontSize: 120,
            color: 'primary.main',
            mb: 3,
            opacity: 0.7,
          }}
        />

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #e50914, #f40612)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 2,
          }}
        >
          Página não encontrada
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            mb: 4,
            maxWidth: 600,
            lineHeight: 1.6,
          }}
        >
          Oops! Parece que a página que você está procurando não existe ou foi movida. 
          Que tal voltar ao início e descobrir alguns filmes incríveis?
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #e50914, #f40612)',
              '&:hover': {
                background: 'linear-gradient(45deg, #b8070f, #d8050e)',
              },
            }}
          >
            Voltar ao Início
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate(-1)}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
            }}
          >
            Página Anterior
          </Button>
        </Box>

        <Box
          sx={{
            mt: 6,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            maxWidth: 500,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
            💡 Você sabia?
          </Typography>
          <Typography variant="body1" color="text.secondary">
            O primeiro filme da história foi "A Chegada de um Trem na Estação", 
            dos irmãos Lumière, em 1895. Era tão realista que as pessoas fugiam 
            da tela com medo de serem atropeladas pelo trem!
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;