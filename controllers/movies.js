const Movie = require('../models/movie');
const {
  CREATED,
} = require('../utils/constants');
const BadRequest = require('../errors/badRequest');
const NotFound = require('../errors/notFound');
const Forbidden = require('../errors/forbidden');

const getCurrentUserMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    return res.send(movies);
  } catch (err) {
    return next(err);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create({ ...req.body, owner: req.user._id });
    return res.status(CREATED).send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequest('Переданы некорректные данные при создании фильма'));
    }
    return next(err);
  }
};

const deleteMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      throw new NotFound('Фильм с указанным _id не найден.');
    }
    if (movie.owner.toString() !== req.user._id) {
      return next(new Forbidden('Недостаточно прав для удаления фильма'));
    }
    await Movie.deleteOne(movie);
    return res.send({ message: 'Фильм удалён' });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequest('Переданы некорректные данные для удаления фильма.'));
    }
    return next(err);
  }
};

module.exports = {
  getCurrentUserMovies,
  createMovie,
  deleteMovieById,
};
