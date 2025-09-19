import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  InputBase,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountCircle,
  Movie as MovieIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';

// Styled components
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      handleMenuClose();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    // Call onSearch callback if provided and we're on the home page
    if (onSearch && location.pathname === '/') {
      onSearch(value);
    }
  };

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter' && searchTerm.trim()) {
      // If not on home page, navigate to home with search
      if (location.pathname !== '/') {
        navigate(`/?search=${encodeURIComponent(searchTerm)}`);
      }
    }
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfile}>
        Meu Perfil
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        Sair
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ bgcolor: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          {/* Logo */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="logo"
            sx={{ mr: 2 }}
            onClick={() => navigate('/')}
          >
            <MovieIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              cursor: 'pointer',
              fontWeight: 'bold',
              color: 'primary.main'
            }}
            onClick={() => navigate('/')}
          >
            SylkFlix
          </Typography>

          {/* Search Box */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Buscar filmes..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleSearchSubmit}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />

          {/* Auth Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user ? (
              <>
                <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', md: 'block' } }}>
                  Olá, {user.displayName || user.email}
                </Typography>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="primary-search-account-menu"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  {user.photoURL ? (
                    <Avatar src={user.photoURL} sx={{ width: 32, height: 32 }} />
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/login')}
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                  Entrar
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => navigate('/register')}
                  size="small"
                >
                  Cadastrar
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
};

export default Header;