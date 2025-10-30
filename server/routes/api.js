const express = require('express');
const axios = require('axios');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const SearchHistory = require('../models/SearchHistory');

// GET /api/top-searches - Get top 5 most frequent search terms
router.get('/top-searches', requireAuth, async (req, res) => {
  try {
    const topSearches = await SearchHistory.aggregate([
      {
        $group: {
          _id: '$term',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          term: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json(topSearches);
  } catch (error) {
    console.error('Error fetching top searches:', error);
    res.status(500).json({ error: 'Failed to fetch top searches' });
  }
});

// POST /api/search - Search images on Unsplash
router.post('/search', requireAuth, async (req, res) => {
  try {
    const { term } = req.body;

    if (!term || term.trim() === '') {
      return res.status(400).json({ error: 'Search term is required' });
    }

    // Save search to history
    await SearchHistory.create({
      userId: req.user._id,
      term: term.trim()
    });

    // Call Unsplash API
    const unsplashResponse = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: term,
        per_page: 30,
        orientation: 'landscape'
      },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });

    const images = unsplashResponse.data.results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      description: photo.description || photo.alt_description,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html
    }));

    res.json({
      term,
      count: images.length,
      images
    });
  } catch (error) {
    console.error('Error searching images:', error);
    
    if (error.response && error.response.status === 403) {
      return res.status(403).json({ error: 'Unsplash API rate limit exceeded. Please try again later.' });
    }
    
    res.status(500).json({ error: 'Failed to search images' });
  }
});

// GET /api/history - Get user's search history
router.get('/history', requireAuth, async (req, res) => {
  try {
    const history = await SearchHistory.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(20)
      .select('term timestamp');

    res.json(history);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

module.exports = router;
