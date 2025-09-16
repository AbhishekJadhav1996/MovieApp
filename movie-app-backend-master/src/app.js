const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const movieRoutes = require('./routes/movieRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/movies', movieRoutes);

app.get('/', (req, res) => {
  res.send('🎬 Welcome to the Movie API!');
});

// Only connect DB if NOT testing
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

module.exports = app;
