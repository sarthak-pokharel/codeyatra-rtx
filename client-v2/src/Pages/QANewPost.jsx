import { useState } from 'react';
import { 
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert
} from '@mui/material';
import { createPostRoute } from '../apiRoutes';
import { useNavigate } from 'react-router-dom';

export default function QANewPost() {
  let nav = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    created_by: '1'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Assuming you have the user ID stored in localStorage or context
      const userId = localStorage.getItem('userId'); // Adjust based on your auth setup
      
      const response = await fetch(createPostRoute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          created_by: parseInt(userId),
          ...formData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      setSuccess('Post created successfully!');
      setFormData({ title: '', description: '', keywords: '' });
      // console.log({data})
      nav("/dashboard/qa/" + data.postId);
      
    } catch (err) {
      setError(err.message);
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
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Create New Post
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            name="title"
            label="Title"
            fullWidth
            required
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            inputProps={{ maxLength: 200 }}
            helperText={`${formData.title.length}/200`}
          />

          <TextField
            name="description"
            label="Description"
            fullWidth
            required
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            inputProps={{ maxLength: 2000 }}
            helperText={`${formData.description.length}/2000`}
          />

          <TextField
            name="keywords"
            label="Keywords"
            fullWidth
            required
            value={formData.keywords}
            onChange={handleChange}
            margin="normal"
            inputProps={{ maxLength: 500 }}
            helperText="Separate keywords with commas (e.g., technology, programming, web)"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={!formData.title || !formData.description || !formData.keywords}
          >
            Create Post
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}