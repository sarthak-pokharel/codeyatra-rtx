import { io } from 'socket.io-client';
import { useEffect, useState, useRef } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Container,
    Typography,
    IconButton,
    ThemeProvider,
    createTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ReactMarkdown from 'react-markdown';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2196f3',
        },
    },
});

const socket = io('http://localhost:5000');

function AIHelper() {
    const [messages, setMessages] = useState([]);
    const [currentResponse, setCurrentResponse] = useState('');
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, currentResponse]);

    useEffect(() => {
        socket.on('chat-response-stream', ({ token }) => {
            setCurrentResponse(prev => prev + token);
        });

        socket.on('chat-complete', ({ fullResponse }) => {
            setMessages(prev => [...prev, { type: 'bot', content: fullResponse }]);
            setCurrentResponse('');
        });

        socket.on('chat-error', ({ error }) => {
            console.error('Chat error:', error);
        });

        return () => {
            socket.off('chat-response-stream');
            socket.off('chat-complete');
            socket.off('chat-error');
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        sendMessage(input);
        setInput('');
    };

    const sendMessage = (message) => {
        socket.emit('chat-query', { message: message, history: messages });
        setMessages(prev => [...prev, { type: 'user', content: message }]);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'grey.100'
            }}>
                <Container maxWidth="md" sx={{ flexGrow: 1, overflow: 'hidden', py: 2 }}>
                    <Paper
                        elevation={3}
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                    >
                        <Box sx={{
                            p: 2,
                            borderBottom: 1,
                            borderColor: 'divider',
                            bgcolor: 'primary.main',
                            color: 'white'
                        }}>
                            <Typography variant="h6">AI Assistant</Typography>
                        </Box>

                        <Box sx={{
                            flexGrow: 1,
                            overflow: 'auto',
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}>
                            {messages.map((message, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                                        gap: 1
                                    }}
                                >
                                    {message.type === 'bot' && (
                                        <IconButton size="small" sx={{ bgcolor: 'primary.main', color: 'white', height: '36px', width: "36px" }}>
                                            <SmartToyIcon />
                                        </IconButton>
                                    )}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            maxWidth: '70%',
                                            p: 2,
                                            bgcolor: message.type === 'user' ? 'primary.main' : 'white',
                                            color: message.type === 'user' ? 'white' : 'text.primary',
                                            border: message.type=="user"? "1px solid #2196f3":"1px solid #000",
                                        }}
                                    >
                                        {message.type === 'user' ? (
                                            <Typography>{message.content}</Typography>
                                        ) : (
                                            <ReactMarkdown>{message.content}</ReactMarkdown>
                                        )}
                                    </Paper>
                                    {message.type === 'user' && (
                                        <IconButton size="small" sx={{ bgcolor: 'grey.300', width: 36, height: 36 }}>
                                            <PersonIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            ))}
                            {currentResponse && (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton size="small" sx={{ bgcolor: 'primary.main', color: 'white',width: 36, height: 36 }}>
                                        <SmartToyIcon />
                                    </IconButton>
                                    <Paper elevation={1} sx={{ maxWidth: '70%', p: 2 }}>
                                        <ReactMarkdown>{currentResponse}</ReactMarkdown>
                                    </Paper>
                                </Box>
                            )}
                            <div ref={messagesEndRef} />
                        </Box>

                        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                            <form onSubmit={handleSubmit}>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField
                                        fullWidth
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type your message..."
                                        variant="outlined"
                                        size="small"
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        endIcon={<SendIcon />}
                                        disabled={!input.trim()}
                                    >
                                        Send
                                    </Button>
                                </Box>
                            </form>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default AIHelper;