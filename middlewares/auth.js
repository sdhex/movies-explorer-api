const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET, devSecret } = require('../utils/config');
const Unauthorized = require('../errors/unauthorized');

const auth = (req, res, next) => {
  const token = req.cookies.authToken;
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production'
        ? JWT_SECRET
        : devSecret,
    );
  } catch (err) {
    throw new Unauthorized('Ошибка токена');
  }
  req.user = payload;
  return next();
};

module.exports = auth;
