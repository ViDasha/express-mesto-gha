const User = require('../models/user');

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
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
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true },
  )
    .then((user) => res.status(200).send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => res.status(200).send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
