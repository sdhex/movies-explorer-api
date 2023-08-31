const moviesRoutes = require('express').Router();

const {
  getCurrentUserMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

const {
  validateGetMovieById,
  validateCreateMovie,
} = require('../utils/validator');

moviesRoutes.get('/', getCurrentUserMovies);
moviesRoutes.post('/', validateCreateMovie, createMovie);
moviesRoutes.delete('/:movieId', validateGetMovieById, deleteMovieById);

module.exports = moviesRoutes;
