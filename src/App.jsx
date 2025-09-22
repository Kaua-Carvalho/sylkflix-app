import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Typography } from '@mui/material';

import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header/Header';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#e50914' },
    background: { default: '#0f0f0f', paper: '#1a1a1a' },
  },
});

const TestHome = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h2" color="white">Home - Com Header</Typography>
  </Box>
);

const TestLogin = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h2" color="white">Login - Com Header</Typography>
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Header />
            <Box sx={{ pt: 8 }}>
              <Routes>
                <Route path="/" element={<TestHome />} />
                <Route path="/login" element={<TestLogin />} />
                <Route path="*" element={<TestHome />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;