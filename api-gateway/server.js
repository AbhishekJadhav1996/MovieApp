require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(morgan('dev'));

// Use environment variable or default to backend service name in Docker Compose
const MOVIE_SERVICE_URL = process.env.MOVIE_SERVICE_URL || 'http://backend:5000';

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', upstream: MOVIE_SERVICE_URL });
});

// Proxy all /api/movies requests to backend
app.use(
  '/api/movies',
  createProxyMiddleware({
    target: MOVIE_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/movies': '/api/movies' },
    logLevel: 'debug',
  })
);

app.use(
  '/api/movies',
  createProxyMiddleware({
    target: MOVIE_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/movies': '/api/movies' },
    logLevel: 'debug',
  })
);
  

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}, proxying to ${MOVIE_SERVICE_URL}`);
});


// require('dotenv').config();
// const express = require('express');
// const { createProxyMiddleware } = require('http-proxy-middleware');
// const cors = require('cors');
// const morgan = require('morgan');

// const app = express();
// app.use(cors());
// app.use(morgan('dev'));

// const MOVIE_SERVICE_URL = process.env.MOVIE_SERVICE_URL || 'http://172.27.59.157:5000';

// // Health check
// app.get('/health', (_req, res) => {
//   res.json({ status: 'ok', upstream: MOVIE_SERVICE_URL });
// });

// // Proxy API requests
// app.use(
//   '/api/movies',
//   createProxyMiddleware({
//     target: MOVIE_SERVICE_URL,
//     changeOrigin: true,
//     pathRewrite: { '^/api/movies': '/api/movies' },
//     logLevel: 'debug',
//   })
// );

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`API Gateway running on port ${PORT}, proxying to ${MOVIE_SERVICE_URL}`);
// });
