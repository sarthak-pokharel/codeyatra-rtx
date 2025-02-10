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
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { businessDemandsRoute } from '../apiRoutes';
import { getRelativeTimeString } from './toolkit';

export default function BusinessDemands() {
  const navigate = useNavigate();
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  const [maxQuantity, setMaxQuantity] = useState('');

  const [searchTrigger, setSearchTrigger] = useState(0);

  useEffect(() => {
    const fetchDemands = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          search_term: searchTerm,
          min_quantity: minQuantity,
          max_quantity: maxQuantity
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
        <Button variant="contained" onClick={handleSearch} size='large' sx={{height: '50px'}}>
          Search
        </Button>
      </Box>
      <Grid container spacing={2}>
        {demands.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Card
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 3,
                  borderLeft: '4px solid #1976d2',
                  transition: 'all 0.2s ease-in-out'
                }
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
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                    {getRelativeTimeString(item.posted_at)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}