const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  images: [{
    imageId: String,
    imageUrl: String,
    thumbnailUrl: String,
    photographer: String,
    photographerUrl: String,
    description: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
collectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compound index for user collections
collectionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Collection', collectionSchema);
