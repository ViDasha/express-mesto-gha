const ValidationError = require('./validation-error');

module.exports.handleErrors = (err, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new ValidationError('Переданы некорректные данные'));
  } else {
    next(err);
  }
};
