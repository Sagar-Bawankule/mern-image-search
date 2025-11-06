const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  githubId: String,
  displayName: {
    type: String,
    required: true
  },
  email: String,
  avatar: String,
  bio: {
    type: String,
    default: ''
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    defaultSearchFilters: {
      orientation: String,
      color: String
    }
  },
  stats: {
    totalSearches: {
      type: Number,
      default: 0
    },
    totalDownloads: {
      type: Number,
      default: 0
    },
    favoriteCount: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Update lastActive on any user activity
userSchema.pre('save', function(next) {
  this.lastActive = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
