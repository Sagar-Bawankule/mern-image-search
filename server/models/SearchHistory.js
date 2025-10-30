const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  term: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
searchHistorySchema.index({ userId: 1, timestamp: -1 });
searchHistorySchema.index({ term: 1 });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
