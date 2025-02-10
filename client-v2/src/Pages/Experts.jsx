import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { _hostname } from '../apiRoutes';
import ExpertForm from './ExpertCreationForm';
import { Container, Typography, List, CircularProgress, Alert, Fab, Card, CardContent, CardActions, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';
import useLocalStorageState from 'use-local-storage-state';

const StyledCard = styled(Card)({
  marginBottom: '20px',
  border: '1px solid #ddd',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    borderColor: '#3f51b5',
  },
});

const StyledFab = styled(Fab)({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  backgroundColor: '#3f51b5',
  '&:hover': {
    backgroundColor: '#303f9f',
  },
});

export default function Experts() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useLocalStorageState('mode', {
    defaultValue:"farmer"
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
          <StyledCard key={expert.id}>
            <CardContent>
              <Typography variant="h5" component="div">
                {expert.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {expert.services}
              </Typography>
              <Typography variant="body1" component="p">
                {expert.description}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Created by: {expert.first_name} {expert.last_name}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary">Learn More</Button>
            </CardActions>
          </StyledCard>
        ))}
      </List>
      {mode=="expert" && <StyledFab
        color="primary"
        aria-label="add"
        onClick={() => setShowForm(true)}
      >
        <AddIcon />
      </StyledFab>}
      {showForm && (
        <ExpertForm setShowForm={setShowForm} />
      )}
    </Container>
  );
}