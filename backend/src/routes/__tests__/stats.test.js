const request = require('supertest');
const express = require('express');
const statsRouter = require('../stats');

const app = express();
app.use(express.json());
app.use('/api/stats', statsRouter);

describe('Stats API', () => {
  it('should return stats with total and averagePrice', async () => {
    const res = await request(app)
      .get('/api/stats')
      .expect(200);

    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('averagePrice');
    expect(typeof res.body.total).toBe('number');
    expect(typeof res.body.averagePrice).toBe('number');
    expect(res.body.total).toBeGreaterThan(0);
  });

  // test that cache works (basic check)
  it('should return consistent results on multiple calls', async () => {
    const res1 = await request(app).get('/api/stats');
    const res2 = await request(app).get('/api/stats');

    expect(res1.body.total).toBe(res2.body.total);
    expect(res1.body.averagePrice).toBe(res2.body.averagePrice);
  });
});
