const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ValidationError = require('../errors/validation-error');

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else {
        res.status(200).send(user);
      }
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      } else {
        res.status(200).send(user);
      }
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  // хэшируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    // вернём записанные в базу данные
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    // данные не записались, вернём ошибку
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Регистрация по существующему E-mail'));
      }
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findOneAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      res.status(200).send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findOneAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      res.status(200).send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      // ошибка аутентификации
      next(new UnauthorizedError(err.message));
    });
};
