const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { CREATED, DUBLICATE_KEY } = require('../utils/constants');
const {
  NODE_ENV,
  JWT_SECRET,
  devSecret,
} = require('../utils/config');
const BadRequest = require('../errors/badRequest');
const NotFound = require('../errors/notFound');
const Conflict = require('../errors/conflict');
const Unauthorized = require('../errors/unauthorized');

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFound('Пользователь по указанному _id не найден.');
    }
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      email, password, name,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hashedPassword, name,
    });
    user.password = undefined;
    return res.status(CREATED).send(user);
  } catch (err) {
    if (err.code === DUBLICATE_KEY) {
      return next(new Conflict('Пользователь с данной почтой уже зарегистрирован'));
    }
    if (err.name === 'ValidationError') {
      return next(new BadRequest('Переданы некорректные данные при создании пользователя'));
    }
    return next(err);
  }
};

const updateUserInfo = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      { new: true, runValidators: true },
    );
    if (!user) {
      throw new NotFound('Пользователь по указанному _id не найден.');
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequest('Переданы некорректные данные при обновлении пользователя'));
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Unauthorized('Проверьте правильность ввода почты и пароля');
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      NODE_ENV === 'production'
        ? JWT_SECRET
        : devSecret,
      { expiresIn: '7d' },
    );

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new Unauthorized('Проверьте правильность ввода почты и пароля');
    }

    return res.cookie('authToken', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
    })
      .send({ message: 'Выполнена авторизация' });
  } catch (err) {
    return next(err);
  }
};

const signOut = async (req, res, next) => {
  try {
    await res.clearCookie('authToken');
    return res.send({ message: 'Выполнен выход' });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getCurrentUser,
  createUser,
  updateUserInfo,
  login,
  signOut,
};
