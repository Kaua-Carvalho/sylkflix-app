import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  const teamMembers = [
    {
      name: 'Stênio Siqueira',
      initial: 'S',
      github: 'https://github.com/StenioSiq',
      avatar: 'https://avatars.githubusercontent.com/u/159480669?v=4',
    },
    {
      name: 'Yago Henrique',
      initial: 'Y',
      github: 'https://github.com/YagoHT',
      avatar: 'https://avatars.githubusercontent.com/u/169946056?v=4', 
    },
    {
      name: 'Luís Gustavo',
      initial: 'L',
      github: 'https://github.com/lgalvesz',
      avatar: 'https://avatars.githubusercontent.com/u/138880659?v=4', 
    },
    {
      name: 'Kauã Carvalho',
      initial: 'K',
      github: 'https://github.com/Kaua-Carvalho',
      avatar: 'https://avatars.githubusercontent.com/u/134431788?v=4', 
    },
  ];

  return (
    <Box component="footer" className="footer-sylkflix">
      <Typography variant="body2" className="footer-copyright">
        © 2025 SylkFlix. Todos os direitos reservados.
      </Typography>

      <Box className="team-section">
        {teamMembers.map((member) => (
          <Box key={member.initial} className="team-member">
            <a href={member.github} target="_blank" rel="noopener noreferrer">
              <img src={member.avatar} alt={member.name} />
            </a>
            <Typography component="p" className="member-name">
              <span className="initial">{member.initial}</span>
              <span className="full-name">{member.name}</span>
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Footer;