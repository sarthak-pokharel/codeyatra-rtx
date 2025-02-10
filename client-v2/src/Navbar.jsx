import React, { useState } from 'react';
// import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Select, FormControl } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mode, setMode] = useState('farmer');

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Add your logout logic here
    navigate('/login');
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  return (
    <>
    
    <AppBar position="fixed">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, letterSpacing: 3 }}>
          AGRIFUSION
        </Typography>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
  <Select
    value={mode}
    onChange={handleModeChange}
    IconComponent={KeyboardArrowDownIcon}
    sx={{
      color: 'white',
      '.MuiOutlinedInput-notchedOutline': { border: 'none' },
      '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
      '.MuiSvgIcon-root': { color: 'white' }
    }}
  >
    <MenuItem value="farmer">I'm a Farmer</MenuItem>
    <MenuItem value="businessman">I'm a Businessman</MenuItem>
    <MenuItem value="expert">I'm an Expert</MenuItem>
  </Select>
</FormControl>
        <IconButton color="inherit" onClick={handleMenuOpen}>
          <Avatar alt="Sarthak" src="/path/to/avatar.jpg" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
    <br/><br/><br/>
    </>
  );
};

export default Navbar;