import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid2 as Grid,
  CircularProgress,
  Box,
  Fab,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getRelativeTimeString } from './toolkit';
import { productionInfoRoute } from '../apiRoutes';
import ProductionSearchFilters from './ProductionSearchFilter';
// import ProductionSearchFilters from '../components/ProductionSearchFilters';
import AddIcon from '@mui/icons-material/Add';
import ProductionStatsPanel from './ProductionStatsPanel';
import useLocalStorageState from 'use-local-storage-state';

export default function ProductionInfo() {
  const navigate = useNavigate();
  const [productionData, setProductionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [district, setDistrict] = useState(''); // Add this state
  const [serarchTrigger, setSearchTrigger] = useState(0);
  const [mode, setMode] = useLocalStorageState('mode', {
      defaultValue:"farmer"
    });

  const fetchProductionInfo = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`${productionInfoRoute}?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setProductionData(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = {};
    if (searchTerm) {
      params.search_term = searchTerm;
    }
    if (district) {
      params.district = district;
    }
    fetchProductionInfo(params);
  }, [serarchTrigger, district]); // Add district to dependency array

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleDistrictChange = (value) => {
    setDistrict(value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }
  const handleCardClick = (id) => {
    navigate(`/dashboard/production-posts/${id}`);
  };

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Container>
    );
  }


  return (
    
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Production Information
      </Typography>

      <ProductionSearchFilters
        searchTerm={searchTerm}
        onSearch={handleSearch}
        district={district}
        onDistrictChange={handleDistrictChange}
        setSearchTrigger={setSearchTrigger}
      />

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ display:'flex' }}>
          <Grid container spacing={2}>
            {productionData.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary" align="center">
                  No production information found.
                </Typography>
              </Grid>
            ) : (
              productionData.map((item) => (
                <Grid item xs={12} key={item.id} sx={{ width: '45%' }}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      width: '100%', // Added width
                      '&:hover': {
                        boxShadow: 3,
                        borderLeft: '4px solid #1976d2',
                        transition: 'all 0.2s ease-in-out'
                      },
                      border: '1px solid grey',
                      minHeight:'200px'
                    }}
                    elevation={0}
                    onClick={() => handleCardClick(item.id)}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontSize: '1.1rem', mb: 0.5 }}>
                            {item.item_label}
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
                            {item.description.substring(0, 50)}...
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right', minWidth: '150px' }}>
                          <Typography variant="body2" color="primary" sx={{ fontWeight: 'medium' }}>
                            NPR {(item.costing_per_month / item.quantity_per_month).toFixed(2)}/kg
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {getRelativeTimeString(item.posted_at)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
          <Box sx={{ width: 230, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
            <ProductionStatsPanel />
          </Box>
        </Box>

        {mode=='farmer'&&<Fab
          color="primary"
          aria-label="add production post"
          onClick={() => navigate('/dashboard/create-new-production-post')}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16
          }}
        >
          <AddIcon />
        </Fab>}
      </Box>
    </Container>
  );
}