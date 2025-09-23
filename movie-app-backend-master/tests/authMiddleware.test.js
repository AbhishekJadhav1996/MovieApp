const Movie = require('../src/models/Movie'); // Adjust path if needed
const { getMovies, addMovie } = require('../src/middleware/authMiddleware'); // Adjust path if needed

describe('Movie Middleware', () => {
  let res;

  beforeEach(() => {
    // Mock response object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(async () => {
    // Clear DB after each test
    await Movie.deleteMany({});
  });

  it('getMovies should return empty array when no movies exist', async () => {
    const req = {};
    await getMovies(req, res);

    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('addMovie should add a new movie successfully', async () => {
    const req = { body: { title: 'Inception', genre: 'Sci-Fi', year: 2010, rating: 9 } };
    await addMovie(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Inception', genre: 'Sci-Fi', year: 2010, rating: 9 })
    );

    // Verify in DB
    const movies = await Movie.find();
    expect(movies.length).toBe(1);
    expect(movies[0].title).toBe('Inception');
  });

  it('addMovie should return 500 if movie cannot be added', async () => {
    // Simulate invalid request (missing title)
    const req = { body: { genre: 'Action' } };
    await addMovie(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
  });

  it('getMovies should return movies if they exist', async () => {
    // Pre-insert a movie
    const movie = new Movie({ title: 'Tenet', genre: 'Action', year: 2020, rating: 7.5 });
    await movie.save();

    const req = {};
    await getMovies(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ title: 'Tenet' })])
    );
  });
});
