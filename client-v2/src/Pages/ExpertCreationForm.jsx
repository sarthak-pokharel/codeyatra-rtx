import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Modal } from '@mui/material';
import axios from 'axios';
import { _hostname } from '../apiRoutes';

export default function ExpertForm() {
  const [formData, setFormData] = useState({
    title: '',
    services: '',
    description: ''
  });
  const [showForm, setShowForm] = useState(true);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      token: localStorage.getItem('token'),
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(_hostname+'/api/new-expert-profile', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Expert profile created successfully:', response.data);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating expert profile:', error);
    }
  };

  return (
    <Modal
      open={showForm}
      onClose={() => setShowForm(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          Create New Expert
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Services"
            name="services"
            value={formData.services}
            onChange={handleInputChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            margin="normal"
            multiline
            rows={4}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
            <Button type="button" variant="outlined" color="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}