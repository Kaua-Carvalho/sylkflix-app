import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Carregando...', fullScreen = false }) => {
  const containerProps = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        bgcolor: 'background.default',
      }
    : {
        py: 8,
      };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight={fullScreen ? '100vh' : '200px'}
      {...containerProps}
    >
      <CircularProgress 
        size={60} 
        thickness={4}
        sx={{ 
          color: 'primary.main',
          mb: 2 
        }} 
      />
      <Typography 
        variant="h6" 
        color="text.secondary"
        sx={{ mt: 2 }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;