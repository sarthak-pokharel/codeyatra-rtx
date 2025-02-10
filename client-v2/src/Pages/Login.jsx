import { useState, useContext } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { UserContext } from './Contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [expiresAt, setExpiresAt] = useState(null);

    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleRequestOTP = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await fetch('http://localhost:5000/api/request-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone_number: phoneNumber }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send OTP');
            }

            setOtpSent(true);
            setExpiresAt(new Date(data.expires_at));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            setLoading(true);
            setError('');
    
            const response = await fetch('http://localhost:5000/api/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    otp: otp
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || 'Failed to verify OTP');
            }
    
            if (data.verified) {
                if (data.isRegistered) {
                    // Store user data and token in localStorage or sessionStorage
                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('token', data.token);
                    setUser(data.user); // Update user context
                    navigate('/dashboard'); // Navigate to dashboard or home page
                } else {
                    // No user found, redirect to registration
                    navigate('/register', { 
                        state: { phoneNumber, verified: true } 
                    });
                }
            } else {
                throw new Error('OTP verification failed');
            }
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
                    Login to <strong style={{letterSpacing:2}}>AgriFusion</strong>
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {!otpSent ? (
                    <>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            variant="outlined"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter your 10-digit phone number"
                            margin="normal"
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleRequestOTP}
                            disabled={loading || phoneNumber.length !== 10}
                            sx={{ mt: 2 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Get OTP'}
                        </Button>
                    </>
                ) : (
                    <>
                        <TextField
                            fullWidth
                            label="Enter OTP"
                            variant="outlined"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            margin="normal"
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleVerifyOTP}
                            disabled={loading || otp.length !== 6}
                            sx={{ mt: 2 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => {
                                setOtpSent(false);
                                setOtp('');
                            }}
                            sx={{ mt: 1 }}
                        >
                            Change Phone Number
                        </Button>
                        {expiresAt && (
                            <Typography variant="caption" display="block" align="center" sx={{ mt: 2 }}>
                                OTP expires at {new Date(expiresAt).toLocaleTimeString()}
                            </Typography>
                        )}
                    </>
                )}
            </Paper>
        </Box>
    );
}