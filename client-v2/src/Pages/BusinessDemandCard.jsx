import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuestionAnswer, Person, Schedule, Add } from '@mui/icons-material';
import { 
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Container,
  Stack,
  Divider,
  Fab,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function BusinessDemandPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinessDemand = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/business-demands/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch business demand details');
        }
        const data = await response.json();
        setPost(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessDemand();
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
            {post.item_name}
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Demand Details
          </Typography>
          <Typography variant="body1" paragraph>
            {post.description}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Required Quantity:</strong> {post.quantity_per_month} units per month
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Posted By
          </Typography>
          <Typography variant="body1">
            {post.first_name} {post.last_name}
          </Typography>
        </CardContent>
      </Card>
      
    </Container>
  );
}