const usersRoutes = require('express').Router();

const {
  getCurrentUser,
  updateUserInfo,
} = require('../controllers/users');

const {
  validateUpdateUser,
} = require('../utils/validator');

usersRoutes.get('/me', getCurrentUser);
usersRoutes.patch('/me', validateUpdateUser, updateUserInfo);

module.exports = usersRoutes;
