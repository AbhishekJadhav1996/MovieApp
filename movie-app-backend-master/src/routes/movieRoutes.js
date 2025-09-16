const express = require('express');
const { getMovies, addMovie, deleteMovie } = require('../controllers/movieController');

const router = express.Router();

router.get('/', getMovies);
router.post('/', addMovie);
router.delete('/:id', deleteMovie);

module.exports = router;
