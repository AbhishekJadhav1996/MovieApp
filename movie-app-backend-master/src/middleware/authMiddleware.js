const Movie = require('../models/Movie');

// @desc    Get all movies
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a new movie
const addMovie = async (req, res) => {
  try {
    const { title, genre, year, rating } = req.body;
    const movie = new Movie({ title, genre, year, rating });
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMovies, addMovie };
