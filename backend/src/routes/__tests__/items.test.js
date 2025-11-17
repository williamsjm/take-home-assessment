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
    // just checking it returns something for now
  });
});
