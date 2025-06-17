const mongoose = require('mongoose');

const GameProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentChapter: {
    type: Number,
    default: 1
  },
});

module.exports = mongoose.model('GameProgress', GameProgressSchema);
