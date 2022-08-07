const User = require('../models/user');

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      if (!user._id) {
        return res.status(400).send({ message: 'Получение пользователя с некорректным id' });
      }
      res.status(200).send(user);
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    // вернём записанные в базу данные
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    // данные не записались, вернём ошибку
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findOneAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      res.status(200).send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findOneAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      res.status(200).send(user);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
