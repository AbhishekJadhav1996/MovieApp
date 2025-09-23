const Movie = require('../src/controllers/movieController');
const { getMovies, addMovie } = require('../src/controllers/movieController');

describe('Movie Controller', () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('getMovies should return empty array initially', async () => {
    await getMovies({}, res);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('addMovie should add a new movie', async () => {
    const req = { body: { title: 'Inception', genre: 'Sci-Fi', year: 2010, rating: 9 } };
    await addMovie(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Inception', genre: 'Sci-Fi' })
    );

    // Verify in DB
    const movies = await Movie.find();
    expect(movies.length).toBe(1);
    expect(movies[0].title).toBe('Inception');
  });

  it('addMovie should handle errors', async () => {
    const req = { body: {} }; // Missing title
    await addMovie(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
  });
});
