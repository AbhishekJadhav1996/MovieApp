const request = require('supertest');
const app = require('../src/app');
const Movie = require('../src/routes/movieRoutes');

describe('Movie API Routes', () => {
  it('GET / should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('🎬 Welcome to the Movie API!');
  });

  it('GET /api/movies should return empty array initially', async () => {
    const res = await request(app).get('/api/movies');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/movies should create a movie', async () => {
    const res = await request(app)
      .post('/api/movies')
      .send({ title: 'Interstellar', genre: 'Sci-Fi', year: 2014, rating: 8.6 });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Interstellar');

    // DB check
    const movies = await Movie.find();
    expect(movies.length).toBe(1);
    expect(movies[0].title).toBe('Interstellar');
  });
});
