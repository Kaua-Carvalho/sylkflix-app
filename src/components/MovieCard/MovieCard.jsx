import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Rating,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  DateRange as DateIcon,
} from '@mui/icons-material';
import { getImageUrl, formatDate } from '../../services/tmdbApi';

const MovieCard = ({ movie, genres = [] }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handlePlayClick = (e) => {
    e.stopPropagation(); 
    navigate(`/movie/${movie.id}`);
  };


  const getGenreNames = () => {
    if (!movie.genre_ids || !genres.length) return [];
    return movie.genre_ids
      .slice(0, 2) 
      .map(id => {
        const genre = genres.find(g => g.id === id);
        return genre ? genre.name : null;
      })
      .filter(Boolean);
  };

  const movieGenres = getGenreNames();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: (theme) => `0 12px 20px -5px ${theme.palette.primary.main}40`,
        },
        '&:hover .play-button': {
          opacity: 1,
          transform: 'translate(-50%, -50%) scale(1)',
        },
        '&:hover .card-media': {
          transform: 'scale(1.05)',
        },
      }}
      onClick={handleCardClick}
    >

      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          className="card-media"
          component="img"
          height="300"
          image={getImageUrl(movie.poster_path)}
          alt={movie.title}
          sx={{
            transition: 'transform 0.3s ease-in-out',
            objectFit: 'cover',
          }}
          onError={(e) => {
            e.target.src = '/placeholder-movie.jpg';
          }}
        />
        
        <IconButton
          className="play-button"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(0.8)',
            opacity: 0,
            transition: 'all 0.3s ease-in-out',
            bgcolor: 'primary.main',
            color: 'white',
            width: 56,
            height: 56,
            '&:hover': {
              bgcolor: 'primary.dark',
              transform: 'translate(-50%, -50%) scale(1.1)',
            },
          }}
          onClick={handlePlayClick}
        >
          <PlayIcon sx={{ fontSize: 30 }} />
        </IconButton>

        {movie.vote_average > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '50%',
              p: 1,
              minWidth: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: movie.vote_average >= 7 ? '#4caf50' : movie.vote_average >= 5 ? '#ff9800' : '#f44336',
                fontWeight: 'bold',
                fontSize: '0.875rem',
              }}
            >
              {movie.vote_average.toFixed(1)}
            </Typography>
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Tooltip title={movie.title} arrow>
          <Typography
            gutterBottom
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1,
            }}
          >
            {movie.title}
          </Typography>
        </Tooltip>

        {movie.release_date && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DateIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(movie.release_date)}
            </Typography>
          </Box>
        )}

        {movieGenres.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
            {movieGenres.map((genre) => (
              <Chip
                key={genre}
                label={genre}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.75rem',
                  height: 24,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                }}
              />
            ))}
          </Box>
        )}

        {movie.overview && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
            }}
          >
            {movie.overview}
          </Typography>
        )}

        {movie.vote_average > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Rating
              value={movie.vote_average / 2}
              precision={0.1}
              size="small"
              readOnly
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              ({movie.vote_count} votos)
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MovieCard;