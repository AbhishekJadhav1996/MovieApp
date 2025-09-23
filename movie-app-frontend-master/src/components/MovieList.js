import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "../index.css"// Import the CSS below

const MovieList = ({ movies, onDeleteMovie }) => {
  const safeMovies = Array.isArray(movies) ? movies : [];

  return (
    <div className="movie-list-container">
      
      {safeMovies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="movies-grid">
          <AnimatePresence>
            {safeMovies.map((movie) => (
              <motion.div
                key={movie._id}
                className="movie-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-desc">
                    {movie.genre} ({movie.year}) ⭐ {movie.rating}
                  </p>
                  <button className="delete-btn" onClick={() => onDeleteMovie(movie._id)}>
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MovieList;
