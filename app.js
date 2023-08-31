const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const routes = require('./routes');
const limiter = require('./middlewares/rate-limiter');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/winston');
const corsConfig = require('./middlewares/corsConfig');
const { PORT, MONGODB } = require('./utils/config');

const app = express();
app.use(express.json());
app.use(corsConfig);
app.use(cookieParser());

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
});

app.use(helmet());
app.use(limiter);

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
