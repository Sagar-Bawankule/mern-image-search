const mongoose = require('mongoose');

const downloadHistorySchema = new mongoose.Schema({
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
  description: String,
  downloadUrl: String,
  quality: {
    type: String,
    enum: ['raw', 'full', 'regular', 'small'],
    default: 'regular'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for user download history
downloadHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('DownloadHistory', downloadHistorySchema);
