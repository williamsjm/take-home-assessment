const request = require('supertest');
const express = require('express');
const itemsRouter = require('../items');

const app = express();
app.use(express.json());
app.use('/api/items', itemsRouter);

describe('Items API', () => {
  // basic test to see if endpoint works
  it('should return items from GET /api/items', async () => {
    const res = await request(app)
      .get('/api/items')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should respect limit parameter', async () => {
    const res = await request(app)
      .get('/api/items?limit=5')
      .expect(200);

    expect(res.body.length).toBeLessThanOrEqual(5);
  });

  // test search functionality
  it('should filter items by query string', async () => {
    const res = await request(app)
      .get('/api/items?q=laptop')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    // all results should match the query
    res.body.forEach(item => {
      expect(item.name.toLowerCase()).toContain('laptop');
    });
  });
});
