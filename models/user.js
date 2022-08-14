const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    validate: [
      isEmail,
      {
        message: 'Неверный формат E-mail',
      },
    ],
  },
  password: {
    type: String,
    require: true,
  },
}, {
  versionKey: false, // You should be aware of the outcome after set to false
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
