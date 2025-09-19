import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Alert,
  Grid,
  Divider,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AccountCircle,
  Email as EmailIcon,
  DateRange as DateIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      displayName: user?.displayName || '',
    }
  });

  const handleEditToggle = () => {
    if (editMode) {
      // Cancel editing - reset form
      reset({ displayName: user?.displayName || '' });
      setEditMode(false);
      setError('');
      setSuccess('');
    } else {
      setEditMode(true);
      setError('');
      setSuccess('');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUserProfile({
        displayName: data.displayName,
      });
      
      setSuccess('Perfil atualizado com sucesso!');
      setEditMode(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Erro ao sair da conta.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não disponível';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
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
          }}
        >
          Meu Perfil
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gerencie suas informações pessoais
        </Typography>
      </Box>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Info Card */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="600">
                Informações Pessoais
              </Typography>
              <IconButton
                onClick={handleEditToggle}
                color="primary"
                sx={{
                  bgcolor: editMode ? 'error.main' : 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: editMode ? 'error.dark' : 'primary.dark',
                  },
                }}
              >
                {editMode ? <CancelIcon /> : <EditIcon />}
              </IconButton>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {editMode ? (
              /* Edit Form */
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  fullWidth
                  label="Nome Completo"
                  margin="normal"
                  {...register('displayName', {
                    required: 'Nome é obrigatório',
                    minLength: {
                      value: 2,
                      message: 'Nome deve ter pelo menos 2 caracteres',
                    },
                  })}
                  error={!!errors.displayName}
                  helperText={errors.displayName?.message}
                />

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                    sx={{ flex: 1 }}
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleEditToggle}
                    disabled={loading}
                    sx={{ flex: 1 }}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Box>
            ) : (
              /* Display Info */
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <AccountCircle sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Nome
                    </Typography>
                    <Typography variant="h6">
                      {user?.displayName || 'Não informado'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="h6">
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <DateIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Membro desde
                    </Typography>
                    <Typography variant="h6">
                      {formatDate(user?.metadata?.creationTime)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Profile Avatar & Actions */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={user?.photoURL}
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                border: '4px solid',
                borderColor: 'primary.main',
              }}
            >
              {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
            </Avatar>

            <Typography variant="h6" gutterBottom>
              {user?.displayName || 'Usuário'}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {user?.email}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Account Actions */}
            <Box sx={{ space: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                color="error"
                sx={{ mt: 2 }}
              >
                Sair da Conta
              </Button>
            </Box>
          </Paper>

          {/* Account Stats */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estatísticas da Conta
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Conta verificada:
                </Typography>
                <Typography variant="body2" color={user?.emailVerified ? 'success.main' : 'warning.main'}>
                  {user?.emailVerified ? 'Sim' : 'Não'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Último login:
                </Typography>
                <Typography variant="body2">
                  {formatDate(user?.metadata?.lastSignInTime)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Back Button */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          sx={{ px: 4 }}
        >
          Voltar ao Início
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;