const mongoose = require('mongoose');
const Movie = require('../models/Movie');

// @desc Get all movies
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Add a new movie
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

// @desc Delete a movie
const deleteMovie = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid movie ID' });
  }

  try {
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMovies, addMovie, deleteMovie };
