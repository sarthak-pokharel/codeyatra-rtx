import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import router from './middlewares/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());


app.use('/api', router); // Add the routing handler for /api


// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});