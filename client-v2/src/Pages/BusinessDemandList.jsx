import { useState, useEffect } from 'react';
import axios from 'axios';
import { businessDemandsRoute } from '../apiRoutes';
import BusinessDemandCard from './BusinessDemandCard';
import { 
  Grid2 as Grid, 
  CircularProgress, 
  Alert, 
  Container,
  Box 
} from '@mui/material';

const BusinessDemandsList = () => {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDemands = async () => {
      try {
        const response = await axios.get(businessDemandsRoute);
        setDemands(response.data.data); // Access the data array from response
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch business demands');
        setLoading(false);
      }
    };

    fetchDemands();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        {demands.map((demand) => (
          <Grid item xs={12} sm={6} md={4} key={demand.id}>
            <BusinessDemandCard demand={demand} />
          </Grid>
        ))}
        {demands.length === 0 && (
          <Grid item xs={12}>
            <Alert severity="info">
              No business demands found
            </Alert>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default BusinessDemandsList;