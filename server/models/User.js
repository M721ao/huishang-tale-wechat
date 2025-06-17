const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  openid: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isNewUser: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('User', UserSchema);
