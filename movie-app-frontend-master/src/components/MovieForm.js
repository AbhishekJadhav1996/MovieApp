import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MovieForm = ({ onAddMovie }) => {
  const [form, setForm] = useState({ title: '', genre: '', year: '', rating: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAddMovie(form);
      setForm({ title: '', genre: '', year: '', rating: '' });
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} />
      <input type="number" name="year" placeholder="Year" value={form.year} onChange={handleChange} />
      <input type="number" name="rating" placeholder="Rating" value={form.rating} onChange={handleChange} />
      <motion.button type="submit" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Add</motion.button>
    </form>
  );
};

export default MovieForm;
