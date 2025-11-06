const express = require('express');
const axios = require('axios');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const SearchHistory = require('../models/SearchHistory');
const Collection = require('../models/Collection');
const Favorite = require('../models/Favorite');
const DownloadHistory = require('../models/DownloadHistory');
const User = require('../models/User');

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

// POST /api/search - Search images on Unsplash with advanced filters
router.post('/search', requireAuth, async (req, res) => {
  try {
    const { term, orientation, color, orderBy, page = 1, perPage = 30 } = req.body;

    if (!term || term.trim() === '') {
      return res.status(400).json({ error: 'Search term is required' });
    }

    // Build Unsplash API params
    const params = {
      query: term,
      per_page: perPage,
      page: page
    };

    if (orientation) params.orientation = orientation;
    if (color) params.color = color;
    if (orderBy) params.order_by = orderBy;

    // Call Unsplash API
    const unsplashResponse = await axios.get('https://api.unsplash.com/search/photos', {
      params,
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });

    const images = unsplashResponse.data.results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      full: photo.urls.full,
      raw: photo.urls.raw,
      small: photo.urls.small,
      description: photo.description || photo.alt_description,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
      likes: photo.likes,
      color: photo.color,
      downloadUrl: photo.links.download
    }));

    // Save search to history
    await SearchHistory.create({
      userId: req.user._id,
      term: term.trim(),
      filters: { orientation, color, orderBy },
      resultsCount: images.length
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.totalSearches': 1 }
    });

    res.json({
      term,
      total: unsplashResponse.data.total,
      totalPages: unsplashResponse.data.total_pages,
      currentPage: page,
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
      .select('term timestamp filters resultsCount');

    res.json(history);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// ============= FAVORITES =============

// GET /api/favorites - Get user's favorites
router.get('/favorites', requireAuth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// POST /api/favorites - Add to favorites
router.post('/favorites', requireAuth, async (req, res) => {
  try {
    const { imageId, imageUrl, thumbnailUrl, photographer, photographerUrl, description, tags } = req.body;

    const favorite = await Favorite.create({
      userId: req.user._id,
      imageId,
      imageUrl,
      thumbnailUrl,
      photographer,
      photographerUrl,
      description,
      tags
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.favoriteCount': 1 }
    });

    res.status(201).json(favorite);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Image already in favorites' });
    }
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// DELETE /api/favorites/:imageId - Remove from favorites
router.delete('/favorites/:imageId', requireAuth, async (req, res) => {
  try {
    const result = await Favorite.findOneAndDelete({
      userId: req.user._id,
      imageId: req.params.imageId
    });

    if (!result) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.favoriteCount': -1 }
    });

    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

// ============= COLLECTIONS =============

// GET /api/collections - Get user's collections
router.get('/collections', requireAuth, async (req, res) => {
  try {
    const collections = await Collection.find({ userId: req.user._id })
      .sort({ updatedAt: -1 });

    res.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

// POST /api/collections - Create new collection
router.post('/collections', requireAuth, async (req, res) => {
  try {
    const { name, description, isPublic, tags } = req.body;

    const collection = await Collection.create({
      userId: req.user._id,
      name,
      description,
      isPublic,
      tags,
      images: []
    });

    res.status(201).json(collection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ error: 'Failed to create collection' });
  }
});

// PUT /api/collections/:id - Update collection
router.put('/collections/:id', requireAuth, async (req, res) => {
  try {
    const { name, description, isPublic, tags } = req.body;

    const collection = await Collection.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, description, isPublic, tags, updatedAt: Date.now() },
      { new: true }
    );

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.json(collection);
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ error: 'Failed to update collection' });
  }
});

// DELETE /api/collections/:id - Delete collection
router.delete('/collections/:id', requireAuth, async (req, res) => {
  try {
    const collection = await Collection.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ error: 'Failed to delete collection' });
  }
});

// POST /api/collections/:id/images - Add image to collection
router.post('/collections/:id/images', requireAuth, async (req, res) => {
  try {
    const { imageId, imageUrl, thumbnailUrl, photographer, photographerUrl, description } = req.body;

    const collection = await Collection.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    // Check if image already exists in collection
    const exists = collection.images.some(img => img.imageId === imageId);
    if (exists) {
      return res.status(400).json({ error: 'Image already in collection' });
    }

    collection.images.push({
      imageId,
      imageUrl,
      thumbnailUrl,
      photographer,
      photographerUrl,
      description
    });

    await collection.save();
    res.json(collection);
  } catch (error) {
    console.error('Error adding image to collection:', error);
    res.status(500).json({ error: 'Failed to add image to collection' });
  }
});

// DELETE /api/collections/:id/images/:imageId - Remove image from collection
router.delete('/collections/:id/images/:imageId', requireAuth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    collection.images = collection.images.filter(img => img.imageId !== req.params.imageId);
    await collection.save();

    res.json(collection);
  } catch (error) {
    console.error('Error removing image from collection:', error);
    res.status(500).json({ error: 'Failed to remove image from collection' });
  }
});

// ============= DOWNLOADS =============

// POST /api/downloads - Record image download
router.post('/downloads', requireAuth, async (req, res) => {
  try {
    const { imageId, imageUrl, thumbnailUrl, photographer, description, downloadUrl, quality } = req.body;

    const download = await DownloadHistory.create({
      userId: req.user._id,
      imageId,
      imageUrl,
      thumbnailUrl,
      photographer,
      description,
      downloadUrl,
      quality
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.totalDownloads': 1 }
    });

    // Trigger Unsplash download endpoint (required by API)
    if (downloadUrl) {
      await axios.get(downloadUrl, {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      });
    }

    res.status(201).json(download);
  } catch (error) {
    console.error('Error recording download:', error);
    res.status(500).json({ error: 'Failed to record download' });
  }
});

// GET /api/downloads - Get user's download history
router.get('/downloads', requireAuth, async (req, res) => {
  try {
    const downloads = await DownloadHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(downloads);
  } catch (error) {
    console.error('Error fetching download history:', error);
    res.status(500).json({ error: 'Failed to fetch download history' });
  }
});

// ============= USER PROFILE & STATS =============

// GET /api/user/profile - Get user profile
router.get('/user/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-googleId -githubId');

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// PUT /api/user/profile - Update user profile
router.put('/user/profile', requireAuth, async (req, res) => {
  try {
    const { displayName, bio, preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        displayName,
        bio,
        preferences
      },
      { new: true }
    ).select('-googleId -githubId');

    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// GET /api/user/dashboard - Get user dashboard data
router.get('/user/dashboard', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    const recentSearches = await SearchHistory.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(5);

    const favoriteCount = await Favorite.countDocuments({ userId: req.user._id });
    const collectionCount = await Collection.countDocuments({ userId: req.user._id });
    const downloadCount = await DownloadHistory.countDocuments({ userId: req.user._id });

    // Get trending searches from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trendingSearches = await SearchHistory.aggregate([
      {
        $match: {
          timestamp: { $gte: sevenDaysAgo }
        }
      },
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
        $limit: 10
      }
    ]);

    res.json({
      stats: {
        totalSearches: user.stats.totalSearches,
        totalDownloads: downloadCount,
        favoriteCount: favoriteCount,
        collectionCount: collectionCount
      },
      recentSearches,
      trendingSearches,
      memberSince: user.createdAt,
      lastActive: user.lastActive
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// GET /api/search/suggestions - Get search suggestions
router.get('/search/suggestions', requireAuth, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    // Get suggestions from user's search history and global searches
    const suggestions = await SearchHistory.aggregate([
      {
        $match: {
          term: { $regex: new RegExp(`^${q}`, 'i') }
        }
      },
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
          _id: 0
        }
      }
    ]);

    res.json(suggestions.map(s => s.term));
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

module.exports = router;
