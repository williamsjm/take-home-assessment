const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

async function readData() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const { limit, q, page, pageSize } = req.query;
    let results = data;

    // Apply search filter
    if (q) {
      results = results.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
    }

    const total = results.length;

    // Handle pagination if page/pageSize provided
    if (page && pageSize) {
      const pageNum = parseInt(page);
      const size = parseInt(pageSize);
      const startIndex = (pageNum - 1) * size;
      const endIndex = startIndex + size;
      results = results.slice(startIndex, endIndex);

      // Return paginated response with metadata
      return res.json({
        data: results,
        total,
        page: pageNum,
        pageSize: size,
        totalPages: Math.ceil(total / size)
      });
    }

    // Legacy support: limit param (for backwards compatibility)
    if (limit) {
      results = results.slice(0, parseInt(limit));
    }

    // Return simple array for non-paginated requests
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    // TODO: Validate payload (intentional omission)
    const item = req.body;
    const data = await readData();
    item.id = Date.now();
    data.push(item);
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;