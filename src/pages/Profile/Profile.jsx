import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Grid,
  Divider,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Rating,
  Alert,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Email as EmailIcon,
  ExitToApp as LogoutIcon,
  Delete as DeleteIcon,
  Movie as MovieIcon,
  Edit as EditIcon,
  PersonRemove as PersonRemoveIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { assistidosApi, authApi } from '../../services/apiService';
import { getImageUrl } from '../../services/tmdbApi';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUserData } = useAuth();

  const [assistidos, setAssistidos] = useState([]);
  const [loadingAssistidos, setLoadingAssistidos] = useState(false);
  const [error, setError] = useState('');

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const filmesPerPage = 6;

  // Dialogs
  const [editNameDialog, setEditNameDialog] = useState({ open: false });
  const [novoNome, setNovoNome] = useState('');
  const [loadingEditName, setLoadingEditName] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState({ open: false, filme: null });
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
  const [loadingDeleteAccount, setLoadingDeleteAccount] = useState(false);

  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const profilePictures = ['Profile0', 'Profile1', 'Profile2', 'Profile3', 'Profile4'];

  const [nomeError, setNomeError] = useState('');

  useEffect(() => {
    loadAssistidos();
  }, []);

  const loadAssistidos = async () => {
    setLoadingAssistidos(true);
    setError('');
    try {
      const response = await assistidosApi.getAllAssistidos();
      setAssistidos(response.data);
    } catch (error) {
      console.error('Erro ao carregar assistidos:', error);
      setError('Erro ao carregar filmes assistidos.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoadingAssistidos(false);
    }
  };

  // ===========================
  // EDIÇÃO DE NOME
  // ===========================
  const handleOpenEditName = () => {
    setNovoNome(user?.displayName || '');
    setEditNameDialog({ open: true });
  };

  const handleCloseEditName = () => {
    setEditNameDialog({ open: false });
    setNovoNome('');
  };

  const handleConfirmEditName = async () => {
    if (!novoNome.trim() || novoNome.length < 3 || novoNome.length > 25) return;

    setLoadingEditName(true);
    try {
      const response = await authApi.updateNome(novoNome);

      // Atualizar token e dados do usuário
      localStorage.setItem('token', response.data.token);
      const userData = {
        id: response.data.id,
        displayName: response.data.nome,
        email: response.data.email,
        profilePicture: user?.profilePicture || 'Profile0'
      };
      localStorage.setItem('user', JSON.stringify(userData));
      updateUserData && updateUserData(userData);

      handleCloseEditName();
      window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar nome:', error);
      setError(error.response?.data?.error || 'Erro ao atualizar nome.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoadingEditName(false);
    }
  };

  // ===========================
  // DELEÇÃO DE FILME
  // ===========================
  const handleOpenDeleteDialog = (filme) => setDeleteDialog({ open: true, filme });
  const handleCloseDeleteDialog = () => setDeleteDialog({ open: false, filme: null });

  const handleConfirmDelete = async () => {
    const filmeId = deleteDialog.filme.id;
    try {
      await assistidosApi.removeAssistido(filmeId);
      setAssistidos(assistidos.filter(f => f.id !== filmeId));
      const totalPages = Math.ceil((assistidos.length - 1) / filmesPerPage);
      if (currentPage > totalPages && currentPage > 1) setCurrentPage(currentPage - 1);
    } catch (error) {
      console.error('Erro ao remover assistido:', error);
      setError('Erro ao remover filme dos assistidos.');
      setTimeout(() => setError(''), 3000);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // ===========================
  // DELEÇÃO DE CONTA
  // ===========================
  const handleOpenDeleteAccount = () => setDeleteAccountDialog(true);
  const handleCloseDeleteAccount = () => setDeleteAccountDialog(false);

  const handleConfirmDeleteAccount = async () => {
    setLoadingDeleteAccount(true);
    try {
      await authApi.deleteAccount();
      if (logout) await logout();
      else if (updateUserData) updateUserData(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      handleCloseDeleteAccount();
      navigate('/');
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      setError('Erro ao deletar conta.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoadingDeleteAccount(false);
    }
  };

  // ===========================
  // AVALIAÇÃO
  // ===========================
  const handleUpdateAvaliacao = async (id, novaAvaliacao) => {
    if (!novaAvaliacao) return;
    try {
      await assistidosApi.updateAvaliacao(id, novaAvaliacao);
      setAssistidos(assistidos.map(f => f.id === id ? { ...f, avaliacao: novaAvaliacao } : f));
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);
      setError('Erro ao atualizar avaliação.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Erro ao sair da conta.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleFilmeClick = (tmdbId) => navigate(`/movie/${tmdbId}`);
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('pt-BR') : 'Não disponível';

  // ===========================
  // PAGINAÇÃO FILMES
  // ===========================
  const indexOfLastFilme = currentPage * filmesPerPage;
  const indexOfFirstFilme = indexOfLastFilme - filmesPerPage;
  const currentFilmes = assistidos.slice(indexOfFirstFilme, indexOfLastFilme);
  const totalPages = Math.ceil(assistidos.length / filmesPerPage);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // ===========================
  // ALTERAR FOTO PERFIL
  // ===========================
  const handleSelectProfilePicture = async (pic) => {
    try {
      await authApi.updateProfilePicture(pic);
      updateUserData({ ...user, profilePicture: pic });
      setOpenProfileDialog(false);
    } catch (err) {
      console.error(err);
      setError('Erro ao atualizar a foto de perfil.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 5, textAlign: 'center' }}>
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
          Gerencie suas informações e filmes assistidos
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Profile Info Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', minHeight: 429 }}>
            {/* Avatar com hover */}
            <Box sx={{ position: 'relative', width: 120, height: 120, mx: 'auto', mb: 2 }}>
              <Avatar
                src={`/ProfilePictures/${user?.profilePicture || 'Profile0'}.jpg`}
                sx={{
                  width: '100%',
                  height: '100%',
                }}
              >
                {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
              </Avatar>

              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  bgcolor: 'rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  '&:hover': { opacity: 1 },
                }}
                onClick={() => setOpenProfileDialog(true)}
              >
                <EditIcon sx={{ color: '#fff', fontSize: 30 }} />
              </Box>
            </Box>

            {/* Nome + Edit Icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', mb: 1 }}>
              <Typography variant="h6">{user?.displayName || 'Usuário'}</Typography>
              <IconButton
                size="small"
                onClick={handleOpenEditName}
                sx={{
                  position: 'absolute',
                  right: 0,
                  color: '#888',
                  '&:hover': { color: '#bbb', bgcolor: 'rgba(255, 255, 255, 0.05)' },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Email */}
            <Box sx={{ textAlign: 'left', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2">{user?.email}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Botões */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              color="error"
              sx={{ mb: 2, mt: 3 }}
            >
              Sair da Conta
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PersonRemoveIcon />}
              onClick={handleOpenDeleteAccount}
              color="error"
              sx={{ borderColor: '#d32f2f', color: '#d32f2f', '&:hover': { borderColor: '#9a0007', bgcolor: 'rgba(211, 47, 47, 0.1)' } }}
            >
              Deletar Conta
            </Button>
          </Paper>

          {/* Estatísticas */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Estatísticas</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Filmes Assistidos:</Typography>
                <Typography variant="body2" fontWeight="600">{assistidos.length}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Avaliação Média:</Typography>
                <Typography variant="body2" fontWeight="600">
                  {assistidos.length > 0
                    ? (assistidos.reduce((acc, f) => acc + f.avaliacao, 0) / assistidos.length).toFixed(1)
                    : '0'} ⭐
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Filmes assistidos */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, minHeight: 580, maxHeight: 580, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Typography variant="h5" gutterBottom fontWeight="600" sx={{ mb: 3 }}>Meus Filmes Assistidos ⭐</Typography>

            {loadingAssistidos ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <LoadingSpinner message="Carregando assistidos..." />
              </Box>
            ) : assistidos.length > 0 ? (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Box sx={{ flex: 1, overflowY: 'hidden', mb: 2 }}>
                  <Grid container spacing={2}>
                    {currentFilmes.map((filme) => (
                      <Grid item xs={12} sm={6} key={filme.id}>
                        <Card sx={{ display: 'flex', height: 125, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
                          <CardMedia
                            component="img"
                            sx={{ width: 90, cursor: 'pointer', objectFit: 'cover' }}
                            image={getImageUrl(filme.posterPath, 'w200')}
                            alt={filme.titulo}
                            onClick={() => handleFilmeClick(filme.tmdbId)}
                          />
                          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 1.5 }}>
                            <Typography
                              variant="h6"
                              component="div"
                              sx={{ cursor: 'pointer', fontSize: '1rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.3, mb: 0.5, '&:hover': { color: 'primary.main' } }}
                              onClick={() => handleFilmeClick(filme.tmdbId)}
                            >
                              {filme.titulo}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5, fontSize: '0.75rem' }}>Sua avaliação:</Typography>
                              <Rating
                                value={filme.avaliacao}
                                max={5}
                                size="small"
                                onChange={(event, newValue) => newValue && handleUpdateAvaliacao(filme.id, newValue)}
                                sx={{ fontSize: '1rem' }}
                              />
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                {formatDate(filme.dataAdicionado)}
                              </Typography>
                              <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(filme)} sx={{ p: 0.5 }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color="primary" size="large" showFirstButton showLastButton />
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <MovieIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Nenhum filme assistido ainda</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>Explore filmes e adicione seus assistidos!</Typography>
                <Button variant="contained" onClick={() => navigate('/')}>Descobrir Filmes</Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* =============================
          Dialog Editar Nome
          ============================= */}
        <Dialog
          open={editNameDialog.open}
          onClose={handleCloseEditName}
          PaperProps={{ sx: { borderRadius: 3, minWidth: 450, background: 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)' } }}
        >
          <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
            <Typography variant="h5" fontWeight="600">Editar Nome de Usuário</Typography>
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Novo Nome"
              value={novoNome}
              onChange={e => {
                const value = e.target.value;
                setNovoNome(value);
                setNomeError(value.length < 3 ? 'O nome deve ter pelo menos 3 caracteres' :
                            value.length > 20 ? 'O nome deve ter no máximo 20 caracteres' : '');
              }}
              error={Boolean(nomeError)}
              helperText={nomeError}
              margin="normal"
              autoFocus
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button
              onClick={handleCloseEditName}
              variant="outlined"
              fullWidth
              disabled={loadingEditName}
              sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'text.primary', '&:hover': { borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(255,255,255,0.05)' } }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmEditName}
              variant="contained"
              fullWidth
              disabled={loadingEditName || Boolean(nomeError) || !novoNome.trim()}
              sx={{ background: 'linear-gradient(45deg, #e50914, #f40612)', '&:hover': { background: 'linear-gradient(45deg, #b8070f, #d8050e)' } }}
            >
              {loadingEditName ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogActions>
        </Dialog>

      {/* =============================
          Dialog Deletar Filme
          ============================= */}
      <Dialog open={deleteDialog.open} onClose={handleCloseDeleteDialog}
      PaperProps={{ sx: { borderRadius: 3, background: 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)' } }}
      >
        <DialogTitle>Remover filme dos assistidos?</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja remover <strong>{deleteDialog.filme?.titulo}</strong> da sua lista?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}
          fullWidth
          variant="outlined"
          sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'text.primary', '&:hover': { borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(255,255,255,0.05)' } }}>
            Cancelar
            </Button>
          <Button color="error" onClick={handleConfirmDelete}
          fullWidth
          variant="contained"
          sx={{ background: 'linear-gradient(45deg, #e50914, #f40612)', '&:hover': { background: 'linear-gradient(45deg, #b8070f, #d8050e)' } }}>
            Remover</Button>
        </DialogActions>
      </Dialog>

      {/* =============================
          Dialog Deletar Conta
          ============================= */}
      <Dialog open={deleteAccountDialog} onClose={handleCloseDeleteAccount}
      PaperProps={{ sx: { borderRadius: 3, background: 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)' } }}>
        <DialogTitle>Deletar Conta</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteAccount}
          fullWidth
          variant="outlined"
          sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'text.primary', '&:hover': { borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(255,255,255,0.05)' } }}>
            Cancelar
            </Button>
          <Button color="error" onClick={handleConfirmDeleteAccount} disabled={loadingDeleteAccount}
          fullWidth
          variant="contained"
          sx={{ background: 'linear-gradient(45deg, #e50914, #f40612)', '&:hover': { background: 'linear-gradient(45deg, #b8070f, #d8050e)' } }}>
            Deletar
            </Button>
        </DialogActions>
      </Dialog>

      {/* =============================
          Dialog Alterar Foto Perfil
          ============================= */}
      <Dialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)}
      PaperProps={{ sx: { borderRadius: 3, background: 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)' } }}>
        <DialogTitle>Escolha uma nova foto de perfil</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            {profilePictures.map((pic) => (
              <Grid item key={pic}>
                <Avatar
                  src={`/ProfilePictures/${pic}.jpg`}
                  sx={{ width: 80, height: 80, cursor: 'pointer' }}
                  onClick={() => handleSelectProfilePicture(pic)}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProfileDialog(false)}
            fullWidth
          variant="outlined"
          sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'text.primary', '&:hover': { borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(255,255,255,0.05)' } }}>
            Cancelar
            </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
