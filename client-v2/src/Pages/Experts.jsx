import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { _hostname } from '../apiRoutes';
import ExpertForm from './ExpertCreationForm';
import { Container, Typography, List, ListItem, ListItemText, Button, CircularProgress, Alert, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function Experts() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    services: '',
    description: '',
    token: localStorage.getItem('token')
  });

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await axios.get(_hostname + '/api/expert-profiles');
        setExperts(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(_hostname + '/api/new-expert-profile', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setShowForm(false);
      setFormData({
        title: '',
        services: '',
        description: '',
        token: localStorage.getItem('token')
      });
      // Refresh the experts list
      const response = await axios.get(_hostname + '/api/expert-profiles');
      setExperts(response.data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Experts Page
      </Typography>
      <List>
        {experts.map((expert) => (
          <ListItem key={expert.id}>
            <ListItemText
              primary={expert.title}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="textPrimary">
                    {expert.services}
                  </Typography>
                  <br />
                  {expert.description}
                  <br />
                  Created by: {expert.first_name} {expert.last_name}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Fab
        color="primary"
        aria-label="add"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px'
        }}
        onClick={() => setShowForm(true)}
      >
        <AddIcon />
      </Fab>
      {showForm && (
        <ExpertForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          setShowForm={setShowForm}
        />
      )}
    </Container>
  );
}