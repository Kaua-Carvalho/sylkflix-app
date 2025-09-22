import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography } from '@mui/material';

// Adicionar o AuthContext
import { AuthProvider } from './contexts/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#e50914' },
    background: { default: '#0f0f0f', paper: '#1a1a1a' },
  },
});

const TestHome = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h2" color="white">Home - Com AuthContext</Typography>
  </Box>
);

const TestLogin = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h2" color="white">Login - Com AuthContext</Typography>
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Routes>
              <Route path="/" element={<TestHome />} />
              <Route path="/login" element={<TestLogin />} />
              <Route path="*" element={<TestHome />} />
            </Routes>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;