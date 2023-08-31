const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
  max: 130,
  windowMS: 100000,
  message: 'Вы больше не можете делать больше запросов в данный момент, попробуйте позже',
});

module.exports = limiter;
