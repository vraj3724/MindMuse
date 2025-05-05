const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    required: true
  },
  sentimentScore: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  keyThemes: [{
    type: String
  }],
  recommendations: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
journalEntrySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('JournalEntry', journalEntrySchema); 