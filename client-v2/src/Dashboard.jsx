import { Box, Drawer, List, ListItem, ListItemIcon, ListItemButton, ListItemText, Typography } from '@mui/material';

import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const drawerWidth = 240;

const Dashboard = () => {
  const navigate = useNavigate();



  return (
    <>
      <Sidebar />
      {/* <Navbar /> */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px` }}>
        <Outlet/>
      </Box></>

  );
};

export default Dashboard;