import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid2 as Grid,
  CircularProgress,
  Box,
  TextField,
  Button,
  Fab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { businessDemandsRoute } from '../apiRoutes';
import { getRelativeTimeString } from './toolkit';
import AddIcon from '@mui/icons-material/Add'; // Add this import
import { districts } from './districts';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';


export default function BusinessDemands() {
  const navigate = useNavigate();
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [maxQuantity, setMaxQuantity] = useState('');
  const [district, setDistrict] = useState('');

  const [searchTrigger, setSearchTrigger] = useState(0);

  useEffect(() => {
    const fetchDemands = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          search_term: searchTerm,
          min_quantity: minQuantity,
          max_quantity: maxQuantity,
          district: district
        }).toString();
        const response = await fetch(`${businessDemandsRoute}?${queryParams}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setDemands(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDemands();
  }, [searchTrigger]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  const handleCardClick = (id) => {
    navigate(`/dashboard/business-demands/${id}`);
  };

  const handleSearch = () => {
    setSearchTrigger(Math.random())
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Business Demands
      </Typography>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Min Quantity"
          variant="outlined"
          type="number"
          value={minQuantity}
          onChange={(e) => setMinQuantity(e.target.value)}
          sx={{ mr: 2 }}
        />
        <TextField
          label="Max Quantity"
          variant="outlined"
          type="number"
          value={maxQuantity}
          onChange={(e) => setMaxQuantity(e.target.value)}
          sx={{ mr: 2 }}
        />
        <FormControl sx={{ mr: 2, minWidth: 200 }}>
  <InputLabel>District</InputLabel>
  <Select
    value={district}
    label="District"
    onChange={(e) => setDistrict(e.target.value)}
  >
    <MenuItem value="">
      <em>All Districts</em>
    </MenuItem>
    {districts.map((dist) => (
      <MenuItem key={dist} value={dist}>
        {dist}
      </MenuItem>
    ))}
  </Select>
</FormControl>
        <Button variant="contained" onClick={handleSearch} size='large' sx={{ height: '50px' }}>
          Search
        </Button>
      </Box>
      <Grid container spacing={1} sx={{ width: '100%' }}>
        {demands.map((item) => (
          <Grid item xs={12} key={item.id} sx={{ width: '100%' }}>
            <Card
              sx={{
                cursor: 'pointer',
                width: '100%',
                minWidth: '100%',
                display: 'block',
                '&:hover': {
                  boxShadow: 3,
                  borderLeft: '4px solid #1976d2',
                  transition: 'all 0.2s ease-in-out'
                },
              }}
              onClick={() => handleCardClick(item.id)}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 0.5 }}>
                      {item.item_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', minWidth: '150px' }}>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
                      {item.quantity_per_month} kg/month
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 1,
                    pt: 1,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Posted by: {item.first_name} {item.last_name}
                  </Typography>
                  {item.district && (
      <>
        <Typography variant="caption" color="text.secondary">•</Typography>
        <Typography 
          variant="caption" 
          color="primary"
          sx={{ 
            backgroundColor: 'primary.50',
            px: 1,
            py: 0.25,
            borderRadius: 1,
            fontSize: '0.75rem',
            textTransform: 'uppercase'
          }}
        >
          {item.district}
        </Typography>
      </>
    )}
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                    {getRelativeTimeString(item.posted_at)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => navigate('/dashboard/create-new-businessdemand')}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          '&:hover': {
            transform: 'scale(1.05)'
          },
          transition: 'transform 0.2s'
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}