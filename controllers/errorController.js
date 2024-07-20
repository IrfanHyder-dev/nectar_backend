const AppError = require('../utils/appErrors');

const handelCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handelDuplicateFieldDB = (err) => {
  const field = Object.keys(err.keyPattern)[0];
  // const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
  // const message = `Duplicate field value: ${value}. Please use another value`;
  const message = `Duplicate ${field}, Please use another ${field}`;
  return new AppError(message, 400);
};

const handelValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  console.log(`*** error stack trace is *** ${err.stack}`);
  res.status(err.statusCode).json({
    // res.status(200).json({
    success: err.success,
    // error: err,
    message: err.message,
    // stack: err.stack,
    data: {},
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
    });
  } else {
    res.status(500).json({
      success: err.success,
      message: 'Something went wrong',
    });
  }
};

const handelJsonwebTokenErrorDB = () =>
  new AppError(`Invalid token.Please login`, 401);

const handelTokenExpiredErrorDB = () =>
  new AppError(`Your token has expires! Please login again.`, 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.success = err.success || false;
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    if (error.name === 'CastError') error = handelCastErrorDB(error);
    if (error.code === 11000) error = handelDuplicateFieldDB(error);
    if (error.name === 'ValidationError')
      error = handelValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError')
      error = handelJsonwebTokenErrorDB(error);
    if (error.name === 'TokenExpiredError')
      error = handelTokenExpiredErrorDB(error);

    sendErrorProd(error, res);
  }
};
