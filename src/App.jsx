import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#e50914' },
    background: { default: '#0f0f0f', paper: '#1a1a1a' },
  },
});

const TestLogin = () => (
  <Box sx={{ p: 4, textAlign: 'center', color: 'white' }}>
    <h2>Login - Teste</h2>
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
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<TestLogin />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;