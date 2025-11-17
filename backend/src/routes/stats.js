const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

let statsCache = null;

// watch for file changes and invalidate cache
try {
  fs.watch(DATA_PATH, (eventType) => {
    if (eventType === 'change') {
      statsCache = null;
    }
  });
} catch (err) {
  // File may not exist in test environment, that's ok
  console.warn('Could not watch data file:', err.message);
}

function calculateStats(items) {
  return {
    total: items.length,
    averagePrice: items.reduce((acc, cur) => acc + cur.price, 0) / items.length
  };
}

// GET /api/stats
router.get('/', (req, res, next) => {
  if (statsCache) {
    return res.json(statsCache);
  }

  fs.readFile(DATA_PATH, (err, raw) => {
    if (err) return next(err);

    const items = JSON.parse(raw);
    statsCache = calculateStats(items);

    // TODO: For production, consider using Redis
    res.json(statsCache);
  });
});

module.exports = router;