const mongoose = require('mongoose');
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    required: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);