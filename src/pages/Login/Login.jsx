import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Movie as MovieIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      await login(data.email, data.senha); // ✅ Já estava correto
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data;
        
        if (status === 401) {
          setError('Email ou senha incorretos.');
        } else if (typeof message === 'object' && !Array.isArray(message)) {
          const errorMessages = Object.values(message).join(', ');
          setError(errorMessages);
        } else if (typeof message === 'string') {
          setError(message);
        } else {
          setError('Erro ao fazer login. Tente novamente.');
        }
      } else {
        setError('Erro de conexão. Verifique sua internet.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            background: 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)',
            border: '1px solid #333',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #e50914, #f40612, #e50914)',
            }
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <MovieIcon
              sx={{
                fontSize: 56,
                color: 'primary.main',
                mb: 2,
                filter: 'drop-shadow(0 0 10px rgba(229, 9, 20, 0.3))',
              }}
            />
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #e50914, #f40612)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', sm: '2.5rem' },
              }}
            >
              SylkFlix
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary"
              sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
            >
              Bem-vindo de volta!
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mt: 1, opacity: 0.8 }}
            >
              Entre na sua conta para continuar explorando
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#f44336'
                }
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              autoFocus
              margin="normal"
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Formato de email inválido',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                },
              }}
            />

            {/* ✅ CORRIGIDO: id="senha" */}
            <TextField
              fullWidth
              id="senha"
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              margin="normal"
              {...register('senha', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'Senha deve ter pelo menos 6 caracteres',
                },
              })}
              error={!!errors.senha}
              helperText={errors.senha?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.8,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                background: 'linear-gradient(45deg, #e50914, #f40612)',
                boxShadow: '0 4px 15px rgba(229, 9, 20, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(45deg, #b8070f, #d8050e)',
                  boxShadow: '0 6px 20px rgba(229, 9, 20, 0.4)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  background: 'rgba(229, 9, 20, 0.3)',
                  boxShadow: 'none',
                  transform: 'none',
                },
                '&:active': {
                  transform: 'translateY(0px)',
                },
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <Divider sx={{ my: 3, opacity: 0.3 }}>
              <Typography variant="body2" color="text.secondary">
                ou
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body1" color="text.secondary">
                Ainda não tem uma conta?
              </Typography>
              <Link
                to="/register"
                style={{
                  textDecoration: 'none',
                }}
              >
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    mt: 1,
                    py: 1.2,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    borderRadius: 2,
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(229, 9, 20, 0.1)',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  Criar Nova Conta
                </Button>
              </Link>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Link
                to="/"
                style={{
                  color: '#888',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.3s ease',
                }}
                onMouseOver={(e) => e.target.style.color = '#bbb'}
                onMouseOut={(e) => e.target.style.color = '#888'}
              >
                ← Voltar para a página inicial
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;