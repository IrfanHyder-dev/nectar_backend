const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const compression = require('compression');
// const monogoSantize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const express = require('express');
const AppError = require('./utils/appErrors');
const globalErrorHandler = require('./natours_controllers/errorController');
// Routes
const userRouter = require('./natours_routes/userRoute');
const tourRouter = require('./natours_routes/tourRoutes');
const reviewRouter = require('./natours_routes/reviewRoutes');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Set Security  HTTP Headers
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit the requests from the same IP
const limiter = rateLimit({
  max: 100,
  window: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data santization against NoSQL query injection
// app.user(monogoSantize());
// Data santization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

app.get('/', (req, res, next) => {
  res.status(200).render('base');
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/review', reviewRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl}`);
  // err.success = 'false';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(compression());
app.use(globalErrorHandler);

module.exports = app;

///ud0QVoREsUANtLuN
