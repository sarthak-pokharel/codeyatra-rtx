import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { _hostname } from './apiRoutes';
import { Container, Typography, CircularProgress, Alert, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { Edit } from '@mui/icons-material';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.post(`${_hostname}/api/user-details`, {
                    token: token
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProfile(response.data.data);
            } catch (err) {
                setError('Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEdit = (field, value) => {
        setEditField(field);
        setEditValue(value);
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            return;
        }

        try {
            const response = await axios.put(`${_hostname}/api/edit-user/${profile.id}`, {
                [editField]: editValue
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProfile({ ...profile, [editField]: editValue });
            setEditField(null);
            setEditValue('');
        } catch (err) {
            setError('Failed to update profile');
        }
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    const nonEditableFields = ['id', 'contact_num', 'country_code'];

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>
            {profile ? (
                <List>
                    {Object.keys(profile).map((key) => (
                        <ListItem key={key}>
                        <ListItemText
                            primary={
                                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                    {key.replace('_', ' ')}
                                </Typography>
                            }
                            secondary={
                                <Typography variant="body1" sx={{color: "#5b5b5b"}}>
                                    <strong>{profile[key]}</strong>
                                </Typography>
                            }
                        />
                        {!nonEditableFields.includes(key) && (
                            <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => handleEdit(key, profile[key])}>
                                    <Edit />
                                </IconButton>
                            </ListItemSecondaryAction>
                        )}
                    </ListItem>
                    ))}
                </List>
            ) : (
                <Alert severity="info">No profile data available</Alert>
            )}

            <Dialog open={!!editField} onClose={() => setEditField(null)}>
                <DialogTitle>Edit {editField}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label={editField}
                        type="text"
                        fullWidth
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditField(null)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Profile;