import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // DO NOT fallback to hardcoded IP
});

// Get all movies
export const getMovies = () => API.get('/movies');

// Add a new movie
export const addMovie = (movieData) => API.post('/movies', movieData);

// Delete a movie
export const deleteMovie = (id) => API.delete(`/movies/${id}`);


// import axios from 'axios';

// const API = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE_URL || 'http://172.27.59.157:5000/api',
// });

// // Get all movies
// export const getMovies = () => API.get('/movies');

// // Add a new movie
// export const addMovie = (movieData) => API.post('/movies', movieData);

// // Delete a movie
// export const deleteMovie = (id) => API.delete(`/movies/${id}`);
