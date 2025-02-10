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
import { _hostname } from '../apiRoutes';
import { districts } from './districts';

export default function ProductionPostCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    item_label: '',
    description: '',
    quantity_per_month: '',
    costing_per_month: '',
    district: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${_hostname}/api/new-production-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity_per_month: parseInt(formData.quantity_per_month),
          costing_per_month: parseInt(formData.costing_per_month),
          token: localStorage.getItem("token"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      navigate('/dashboard/production-info');
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
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          New Production Post
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
            id="item_label"
            label="Item Name"
            name="item_label"
            value={formData.item_label}
            onChange={handleChange}
            inputProps={{ maxLength: 200 }}
          />

          <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
            <TextField
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

            <TextField
              required
              fullWidth
              id="costing_per_month"
              label="Cost per Month (NPR)"
              name="costing_per_month"
              type="number"
              value={formData.costing_per_month}
              onChange={handleChange}
              inputProps={{ min: 1 }}
            />
          </Box>

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
            inputProps={{ maxLength: 2000 }}
            helperText={`${formData.description.length}/2000`}
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Submit'}
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/dashboard/production-info')}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}