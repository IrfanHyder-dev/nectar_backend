const express = require('express');
// const dotenv = require('dotenv');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');
const AppError = require('./utils/appErrors');
const globalErrorHandler = require('./controllers/errorController');
// dotenv.config({ path: './config.env' });

const app = express();
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res, next) => {
  console.log(`api body is ${req.body}`);
  res.status(200).json({ message: 'API is running' });
});

app.use('/api/v1/users', userRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
