import React, { useEffect, useState } from "react";
import { getMovies, addMovie, deleteMovie } from "./api";
import MovieForm from "./components/MovieForm";
import MovieList from "./components/MovieList";
import Navbar from "./components/Navbar";
import FeatureBanner from "./components/FeatureBanner";
import StatsStrip from "./components/StatsStrip";
import HeroCarousel from "./components/HeroCarousel";
import "./index.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [currentHero, setCurrentHero] = useState(null);

  // Fetch movies on mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await getMovies();
        setMovies(Array.isArray(data) ? data : data.movies || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
      }
    };
    fetchMovies();
  }, []);

  // Add a new movie
  const handleAddMovie = async (movieData) => {
    try {
      const { data } = await addMovie(movieData);
      setMovies((prev) => [...prev, data]);
      setCurrentHero(data.title);
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  // Delete a movie
  const handleDeleteMovie = async (id) => {
    try {
      await deleteMovie(id);
      setMovies((prev) => prev.filter((movie) => movie._id !== id));
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  return (
    <div>
      {/* Background carousel */}
      <HeroCarousel currentHero={currentHero} />

      {/* Overlay content on top of carousel */}
      <div className="overlay-content">
        <Navbar />
        <FeatureBanner />
        <StatsStrip />

        {/* Main app content now on overlay */}
        <div className="app-container">
          <MovieForm onAddMovie={handleAddMovie} />
          <MovieList movies={movies} onDeleteMovie={handleDeleteMovie} />
        </div>
      </div>
    </div>
  );
}

export default App;
