const Movie = require('../src/models/Movie');

describe('Movie Model Test', () => {
  it('should create & save a movie successfully', async () => {
    const validMovie = new Movie({ title: 'Inception', genre: 'Sci-Fi', year: 2010, rating: 9 });
    const savedMovie = await validMovie.save();

    expect(savedMovie._id).toBeDefined();
    expect(savedMovie.title).toBe('Inception');
    expect(savedMovie.genre).toBe('Sci-Fi');
    expect(savedMovie.year).toBe(2010);
    expect(savedMovie.rating).toBe(9);
  });

  it('should fail if title is missing', async () => {
    const movieWithoutTitle = new Movie({ genre: 'Action' });
    let err;
    try {
      await movieWithoutTitle.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.title).toBeDefined();
  });
});
