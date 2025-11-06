const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  imageId: {
    type: String,
    required: true
  },
  imageUrl: String,
  thumbnailUrl: String,
  photographer: String,
  photographerUrl: String,
  description: String,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index to prevent duplicate favorites
favoriteSchema.index({ userId: 1, imageId: 1 }, { unique: true });

// Index for sorting by date
favoriteSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Favorite', favoriteSchema);
