import { Box, Drawer, List, ListItem, ListItemIcon, ListItemButton, ListItemText, Typography } from '@mui/material';

import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ProductionInfo from './Pages/ProductionInfo';
import HomePage from './Pages/HomePage';
import BusinessDemands from './Pages/BusinessDemands';

const drawerWidth = 240;

const Dashboard = () => {
  const navigate = useNavigate();



  return (
    <>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: `${drawerWidth}px` }}>
        <Outlet/>
      </Box></>

  );
};

export default Dashboard;