import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { _hostname, businessDemandsRoute } from '../apiRoutes';
import { districts } from './districts';

export default function BusinessDemandPostForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    item_name: '',
    quantity_per_month: '',
    description: '',
    district: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${_hostname}/api/new-business-demand`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity_per_month: parseInt(formData.quantity_per_month),
          token: localStorage.getItem("token"), // TODO: Replace with actual user ID from auth context
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      navigate('/dashboard/business-demands');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4}}>
        <Typography variant="h4" gutterBottom>
          Create New Business Demand
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="item_name"
            label="Item Name"
            name="item_name"
            value={formData.item_name}
            onChange={handleChange}
            inputProps={{ maxLength: 200 }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="quantity_per_month"
            label="Quantity per Month (kg)"
            name="quantity_per_month"
            type="number"
            value={formData.quantity_per_month}
            onChange={handleChange}
            inputProps={{ min: 1 }}
          />

<FormControl
            margin="normal"
            required
            fullWidth
          >
            <InputLabel id="district-label">District</InputLabel>
            <Select
              labelId="district-label"
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              label="District"
            >
              {districts.map((district) => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            id="description"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            inputProps={{ maxLength: 1000 }}
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Demand'}
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/dashboard/business-demands')}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}