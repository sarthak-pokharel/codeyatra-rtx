import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import router from './middlewares/api.js';
import { router as chatbotRouter, initializeSocket } from './middlewares/chatbothandler.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Add these lines near the top of your file after the imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express and HTTP server
const app = express();
const httpServer = createServer(app);

// Configure Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client-v2/dist')));


// API routes
app.use('/api/chat', chatbotRouter);
app.use('/api', router);



// Initialize Socket.IO handlers
initializeSocket(io);

// Base route
// app.get('/', (req, res) => {
//     res.send('Server is running');
// });

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client-v2/dist/index.html'));
});



// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});