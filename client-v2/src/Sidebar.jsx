import { Box, Drawer, List, ListItem, ListItemIcon, ListItemButton, ListItemText, Typography, Divider } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import BookingsIcon from '@mui/icons-material/BookOnline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Production Posts', icon: <HomeIcon />, path: '/dashboard/production-posts' },
    { text: 'Business Demands', icon: <ExploreIcon />, path: '/dashboard/business-demands' },
    { text: 'Forum', icon: <ExploreIcon />, path: '/dashboard/qa' },
    { text: 'Profile', icon: <AccountCircleIcon />, path: '/dashboard/profile' },
    { text: 'Experts', icon: <ExploreIcon />, path: '/dashboard/experts-list' },
    { text: 'AI Helper', icon: <ExploreIcon />, path: "/dashboard/ai-helper" }
  ];

  return (
    <>
    <Navbar />
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        anchor="left"
        transitionDuration={0} // Disable transitions
      >
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <Typography variant="h6" sx={{ px: 2, py: 1, letterSpacing: 3, fontWeight: 'bold' }}>
            <strong>AGRIFUSION</strong>
          </Typography>
          <Divider/>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

        </Box>
      </Drawer>
      
    </Box>
    </>
  );
};

export default Sidebar;