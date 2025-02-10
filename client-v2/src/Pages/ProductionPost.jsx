import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Button,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ProductionPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductionPost = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/production-info/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch production details');
        }
        const data = await response.json();
        setPost(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductionPost();
  }, [id]);

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

  return (
    <Container sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to List
      </Button>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {post.item_label}
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Production Details
          </Typography>
          <Typography variant="body1" paragraph>
            {post.description}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Monthly Production:</strong> {post.quantity_per_month} units
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Monthly Cost:</strong> Rs. {post.costing_per_month}
            </Typography>
            <Typography variant="body1">
              <strong>Cost per Unit:</strong> Rs. {(post.costing_per_month / post.quantity_per_month).toFixed(2)}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Producer Information
          </Typography>
          <Typography variant="body1">
            {post.first_name} {post.last_name}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}