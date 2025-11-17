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

  describe('Pagination', () => {
    it('should return paginated results with metadata', async () => {
      const res = await request(app)
        .get('/api/items?page=1&pageSize=5')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('page', 1);
      expect(res.body).toHaveProperty('pageSize', 5);
      expect(res.body).toHaveProperty('totalPages');
      expect(res.body.data.length).toBeLessThanOrEqual(5);
    });

    it('should handle page 2 correctly', async () => {
      const res = await request(app)
        .get('/api/items?page=2&pageSize=3')
        .expect(200);

      expect(res.body.page).toBe(2);
      expect(res.body.data.length).toBeLessThanOrEqual(3);
    });

    it('should work with search and pagination together', async () => {
      const res = await request(app)
        .get('/api/items?q=laptop&page=1&pageSize=2')
        .expect(200);

      expect(res.body.data).toBeInstanceOf(Array);
      res.body.data.forEach(item => {
        expect(item.name.toLowerCase()).toContain('laptop');
      });
    });
  });

  describe('GET /api/items/:id', () => {
    it('should return a single item by id', async () => {
      const res = await request(app)
        .get('/api/items/1')
        .expect(200);

      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('name');
    });

    it('should return 404 for non-existent item', async () => {
      const res = await request(app)
        .get('/api/items/99999')
        .expect(404);
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item', async () => {
      const newItem = {
        name: 'Test Item',
        price: 99.99
      };

      const res = await request(app)
        .post('/api/items')
        .send(newItem)
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(newItem.name);
      expect(res.body.price).toBe(newItem.price);
    });
  });
});
