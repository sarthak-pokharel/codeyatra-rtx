import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert, MenuItem } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Registeration() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const locationState = useLocation();
    const { phoneNumber } = locationState.state || {};

    const handleRegister = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch('http://localhost:5000/api/new-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contact_num: phoneNumber,
                    first_name: firstName,
                    last_name: lastName,
                    contact_email: email,
                    gender: gender,
                    location_raw: location,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to register');
            }

            // Store user data in localStorage or context
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/dashboard'); // Navigate to dashboard or home page
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5'
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 400,
                }}
            >
                <Typography variant="h5" component="h1" gutterBottom align="center">
                    Register to <strong style={{ letterSpacing: 2 }}>AgriFusion</strong>
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    margin="normal"
                />
                <TextField
                    fullWidth
                    select
                    label="Gender"
                    variant="outlined"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    placeholder="Select your gender"
                    margin="normal"
                >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                </TextField>
                <TextField
                    fullWidth
                    label="Location"
                    variant="outlined"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your location"
                    margin="normal"
                />
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleRegister}
                    disabled={loading}
                    sx={{ mt: 2 }}
                >
                    {loading ? 'Registering...' : 'Register'}
                </Button>
            </Paper>
        </Box>
    );
}